import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GatePass, GatePassDocument } from './schemas/gate-pass.schema';
import { Visitor, VisitorDocument } from '../visitors/schemas/visitor.schema';
import * as QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

// Define the visitor fields we need for PDF
interface VisitorInfo {
  name: string;
  cnic: string;
  company?: string;
  purpose: string;
  visitDate: Date;
}

@Injectable()
export class GatePassesService {
  constructor(
    @InjectModel(GatePass.name) private gatePassModel: Model<GatePassDocument>,
    @InjectModel(Visitor.name) private visitorModel: Model<VisitorDocument>,
  ) {}

  async create(data: { visitorId: string }): Promise<GatePassDocument> {
    const gatePassNumber = `GP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const qrData = JSON.stringify({
      gatePassNumber,
      visitorId: data.visitorId,
      issuedAt: new Date(),
    });
    const qrCode = await QRCode.toDataURL(qrData);

    const gatePass = new this.gatePassModel({
      gatePassNumber,
      visitorId: data.visitorId,
      qrCode,
      issuedAt: new Date(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'active',
    });

    return gatePass.save();
  }

  async findAll(): Promise<GatePassDocument[]> {
    return this.gatePassModel.find().populate('visitorId').exec();
  }

  async findById(id: string): Promise<GatePassDocument> {
    const gatePass = await this.gatePassModel
      .findById(id)
      .populate('visitorId')
      .exec();

    if (!gatePass) {
      throw new NotFoundException('Gate pass not found');
    }
    return gatePass;
  }

  async findByNumber(gatePassNumber: string): Promise<GatePassDocument> {
    const gatePass = await this.gatePassModel
      .findOne({ gatePassNumber })
      .populate('visitorId')
      .exec();

    if (!gatePass) {
      throw new NotFoundException('Gate pass not found');
    }
    return gatePass;
  }

  async updateCheckIn(visitorId: string, gate: string): Promise<void> {
    await this.gatePassModel
      .findOneAndUpdate(
        { visitorId },
        {
          checkInTime: new Date(),
          gate,
          status: 'used',
        },
      )
      .exec();
  }

  async updateCheckOut(visitorId: string): Promise<void> {
    await this.gatePassModel
      .findOneAndUpdate(
        { visitorId },
        {
          checkOutTime: new Date(),
        },
      )
      .exec();
  }

  async revoke(id: string): Promise<GatePassDocument> {
    const gatePass = await this.gatePassModel
      .findByIdAndUpdate(id, { status: 'revoked' }, { new: true })
      .exec();
    if (!gatePass) {
      throw new NotFoundException('Gate pass not found');
    }
    return gatePass;
  }

  async generatePDF(gatePassNumber: string, res: Response): Promise<void> {
    const gatePass = await this.findByNumber(gatePassNumber);

    // Get the visitor details separately if not populated
    let visitorInfo: VisitorInfo;

    if (gatePass.visitorId && typeof gatePass.visitorId === 'object') {
      // If visitor is populated (as an object)
      const visitor = gatePass.visitorId as unknown as VisitorInfo;
      visitorInfo = {
        name: visitor.name,
        cnic: visitor.cnic,
        company: visitor.company,
        purpose: visitor.purpose,
        visitDate: visitor.visitDate,
      };
    } else {
      // If visitorId is just an ObjectId, fetch the visitor
      const visitor = await this.visitorModel
        .findById(gatePass.visitorId)
        .exec();
      if (!visitor) {
        throw new NotFoundException('Visitor not found');
      }
      visitorInfo = {
        name: visitor.name,
        cnic: visitor.cnic,
        company: visitor.company,
        purpose: visitor.purpose,
        visitDate: visitor.visitDate,
      };
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=gate-pass-${gatePassNumber}.pdf`,
    );

    doc.pipe(res);

    doc.fontSize(20).text('SafePass Visitor Gate Pass', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Gate Pass Number: ${gatePass.gatePassNumber}`, {
      align: 'center',
    });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Visitor Name: ${visitorInfo.name}`);
    doc.text(`CNIC: ${visitorInfo.cnic}`);
    doc.text(`Company: ${visitorInfo.company || 'N/A'}`);
    doc.text(`Purpose: ${visitorInfo.purpose}`);
    doc.text(
      `Visit Date: ${new Date(visitorInfo.visitDate).toLocaleDateString()}`,
    );
    doc.moveDown();

    doc.text('Scan QR Code for Verification:', { underline: true });
    doc.image(gatePass.qrCode, { width: 150, height: 150 });
    doc.moveDown();

    doc.fontSize(10);
    doc.text(`Issued: ${gatePass.issuedAt.toLocaleString()}`);
    doc.text(`Valid Until: ${gatePass.validUntil.toLocaleString()}`);

    doc.moveDown();
    doc.fontSize(8).text('This is an electronically generated gate pass.', {
      align: 'center',
    });

    doc.end();
  }
}
