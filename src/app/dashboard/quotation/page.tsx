'use client';

import { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

type Charge = { id: string; description: string; qty: number; unitPrice: number };

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function QuotationPage(): JSX.Element {
  // Company (sender)
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');

  // Recipient
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  // Charges
  const [charges, setCharges] = useState<Charge[]>(() => [
    { id: uid(), description: 'Duty Charges', qty: 1, unitPrice: 0 },
    { id: uid(), description: 'Transport & Delivery', qty: 1, unitPrice: 0 },
    { id: uid(), description: 'Customs Clearance', qty: 1, unitPrice: 0 },
    { id: uid(), description: 'Documentation', qty: 1, unitPrice: 0 },
    { id: uid(), description: 'Storage', qty: 1, unitPrice: 0 },
  ]);

  // Signature & stamp
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [stampDataUrl, setStampDataUrl] = useState<string | null>(null);

  // Other fields
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');

  const chargesTotal = useMemo(
    () => charges.reduce((s, c) => s + (c.qty || 0) * (c.unitPrice || 0), 0),
    [charges]
  );

  const updateCharge = (id: string, key: keyof Charge, value: string | number) =>
    setCharges((s) => s.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const addChargeRow = () =>
    setCharges((s) => [...s, { id: uid(), description: 'Custom Charge', qty: 1, unitPrice: 0 }]);

  const removeChargeRow = (id: string) =>
    setCharges((s) => (s.length > 1 ? s.filter((r) => r.id !== id) : s));

  function fileToDataUrl(file: File | null, setter: (v: string | null) => void) {
    if (!file) {
      setter(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setter(String(reader.result));
    reader.readAsDataURL(file);
  }

  /* ===================================================================
     PDF EXPORT
  =================================================================== */
  async function exportPDF() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    let y = margin;

    // Logo
    if (logoPreview) {
      try {
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = 150;
        const x = (pageWidth - imgWidth) / 2;
        doc.addImage(logoPreview, 'PNG' as any, x, y, imgWidth, 60);
        y += 70;
      } catch (e) {
        y += 10;
      }
    }

    doc.setFontSize(18);
    doc.text('Quotation', margin, y);
    doc.setFontSize(10);
    doc.text(new Date().toLocaleString(), margin, y + 16);

    // Sender
    y += 36;
    doc.setFontSize(11);
    doc.setFont("helvetica", 'bold');
    doc.text('From:', margin, y);
    doc.setFont("helvetica", 'normal');
    doc.text(companyName || '-', margin, y + 14);
    if (companyAddress) doc.text(companyAddress, margin, y + 28);
    doc.text(`Phone: ${companyPhone || '-'}`, margin, y + 42);
    doc.text(`Email: ${companyEmail || '-'}`, margin, y + 56);

    // Recipient
    const rightX = 340;
    doc.setFont("helvetica", 'bold');
    doc.text('To:', rightX, y);
    doc.setFont("helvetica", 'normal');
    doc.text(recipientName || '-', rightX, y + 14);
    if (recipientAddress) doc.text(recipientAddress, rightX, y + 28);
    doc.text(`Phone: ${recipientPhone || '-'}`, rightX, y + 42);
    doc.text(`Email: ${recipientEmail || '-'}`, rightX, y + 56);

    y += 80;

    autoTable(doc, {
      startY: y,
      head: [['Description', 'Qty', 'Unit Price', 'Subtotal']],
      body: charges.map((c) => [
        c.description,
        String(c.qty),
        Number(c.unitPrice).toFixed(2),
        (c.qty * c.unitPrice).toFixed(2),
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: margin, right: margin },
    });

    const lastY = (doc as any).lastAutoTable?.finalY || y + 120;
    let totalsY = lastY + 12;

    doc.setFontSize(11);
    doc.text(`Charges subtotal: ${chargesTotal.toFixed(2)}`, 380, totalsY, { align: 'right' });

    totalsY += 16;
    doc.setFont("helvetica", 'bold');
    doc.setFontSize(13);
    doc.text(`Grand total: ${chargesTotal.toFixed(2)}`, 380, totalsY, { align: 'right' });

    totalsY += 26;

    // Notes
    doc.setFont("helvetica", 'normal');
    doc.setFontSize(10);
    doc.text('Notes:', margin, totalsY);
    doc.text(doc.splitTextToSize(notes || '-', 450), margin, totalsY + 12);

    totalsY += 40;
    doc.text('Payment Details:', margin, totalsY);
    doc.text(doc.splitTextToSize(paymentDetails || '-', 450), margin, totalsY + 12);

    doc.save(`DutyCalc_Quotation_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  /* ===================================================================
     WORD EXPORT
  =================================================================== */
  async function exportWord() {
    const children: any[] = [];

    children.push(new Paragraph({ children: [new TextRun({ text: 'Quotation', bold: true, size: 32 })] }));
    children.push(new Paragraph({ text: `Date: ${new Date().toLocaleString()}` }));
    children.push(new Paragraph({ text: '' }));

    children.push(new Paragraph({
      children: [new TextRun({ text: 'From:', bold: true }), new TextRun({ text: ` ${companyName}` })],
    }));
    if (companyAddress) children.push(new Paragraph({ text: companyAddress }));
    children.push(new Paragraph({ text: `Phone: ${companyPhone}   Email: ${companyEmail}` }));

    children.push(new Paragraph({ text: '' }));

    children.push(new Paragraph({
      children: [new TextRun({ text: 'To:', bold: true }), new TextRun({ text: ` ${recipientName}` })],
    }));
    if (recipientAddress) children.push(new Paragraph({ text: recipientAddress }));
    children.push(new Paragraph({ text: `Phone: ${recipientPhone}   Email: ${recipientEmail}` }));

    children.push(new Paragraph({ text: '' }));
    children.push(new Paragraph({ children: [new TextRun({ text: 'Charges:', bold: true })] }));

    charges.forEach((c) =>
      children.push(
        new Paragraph({
          text: `${c.description} — qty: ${c.qty} — unit: ${c.unitPrice} — subtotal: ${
            c.qty * c.unitPrice
          }`,
        })
      )
    );

    children.push(new Paragraph({ text: '' }));
    children.push(new Paragraph({ text: `Total: ${chargesTotal.toFixed(2)}` }));

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `DutyCalc_Quotation_${new Date().toISOString().slice(0, 10)}.docx`);
  }

  /* 
     WHATSAPP FORMAT (COPY + AUTO SEND)
   */
  function buildWhatsappMessage() {
    const lines: string[] = [];

    lines.push('📄 *QUOTATION*');
    lines.push('');

    lines.push(`*From:* ${companyName || '-'}`);
    if (companyAddress) lines.push(companyAddress);
    lines.push(`Phone: ${companyPhone || '-'}`);
    lines.push(`Email: ${companyEmail || '-'}`);
    lines.push('');

    lines.push(`*To:* ${recipientName || '-'}`);
    if (recipientAddress) lines.push(recipientAddress);
    lines.push(`Phone: ${recipientPhone || '-'}`);
    lines.push(`Email: ${recipientEmail || '-'}`);
    lines.push('');

    lines.push('-----------------------');
    lines.push('*Charges:*');

    charges.forEach((c) => {
      lines.push(
        `• ${c.description} — ₦${(c.qty * c.unitPrice).toLocaleString()}`
      );
    });

    lines.push('');
    lines.push(`*Grand Total:* ₦${chargesTotal.toLocaleString()}`);
    lines.push('');

    if (notes) {
      lines.push('*Notes:*');
      lines.push(notes);
      lines.push('');
    }

    if (paymentDetails) {
      lines.push('*Payment Details:*');
      lines.push(paymentDetails);
      lines.push('');
    }

    lines.push('-----------------------');
    lines.push('Sent from DutyCalc Quotation Tool');

    return lines.join('\n');
  }

  function copyWhatsappStyle() {
    const text = buildWhatsappMessage();
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied in WhatsApp format!'))
      .catch(() => alert('Copy failed'));
  }

  function sendToWhatsapp() {
    const message = encodeURIComponent(buildWhatsappMessage());

    const number = recipientPhone.replace(/\D+/g, ''); // Clean up user input

    const url = `https://wa.me/${number}?text=${message}`;

    window.open(url, '_blank');
  }

  /* ===================================================================
     RENDER UI
  =================================================================== */
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Quotation Tool</h1>

        {/* Logo Upload */}
        <div className="bg-white p-4 rounded shadow">
          <label className="block text-sm font-medium mb-2">
            Company Logo (preview)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => fileToDataUrl(e.target.files?.[0] ?? null, setLogoPreview)}
          />
          {logoPreview && (
            <div className="flex justify-center mt-3">
              <img src={logoPreview} alt="logo preview" className="h-20 object-contain" />
            </div>
          )}
        </div>

        {/* Sender & Recipient */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Company (Sender)</h3>
            <input
              placeholder="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2 border rounded my-2"
            />
            <input
              placeholder="Address"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="w-full p-2 border rounded my-2"
            />
            <input
              placeholder="Phone"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              className="w-full p-2 border rounded my-2"
            />
            <input
              placeholder="Email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="w-full p-2 border rounded my-2"
            />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Recipient</h3>
            <input
              placeholder="Recipient name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full p-2 border rounded my-2"
            />
            <input
              placeholder="Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full p-2 border rounded my-2"
            />
            <input
              placeholder="Phone"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="w-full p-2 border rounded my-2"
            />
            <input
              placeholder="Email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full p-2 border rounded my-2"
            />
          </div>
        </div>

        {/* Charges */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Charges</h3>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border w-20">Qty</th>
                  <th className="p-2 border w-32">Unit Price</th>
                  <th className="p-2 border w-32">Subtotal</th>
                  <th className="p-2 border w-20">Action</th>
                </tr>
              </thead>

              <tbody>
                {charges.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="p-2">
                      <input
                        value={c.description}
                        onChange={(e) =>
                          updateCharge(c.id, 'description', e.target.value)
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>

                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min={0}
                        value={c.qty}
                        onChange={(e) =>
                          updateCharge(c.id, 'qty', Number(e.target.value || 0))
                        }
                        className="w-16 p-1 text-center border rounded"
                      />
                    </td>

                    <td className="p-2 text-right">
                      <input
                        type="number"
                        min={0}
                        value={c.unitPrice}
                        onChange={(e) =>
                          updateCharge(c.id, 'unitPrice', Number(e.target.value || 0))
                        }
                        className="w-28 p-1 text-right border rounded"
                      />
                    </td>

                    <td className="p-2 text-right">
                      {(c.qty * c.unitPrice).toFixed(2)}
                    </td>

                    <td className="p-2 text-center">
                      <button
                        onClick={() => removeChargeRow(c.id)}
                        className="text-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button onClick={addChargeRow} className="px-3 py-1 rounded border">
              Add Charge Row
            </button>

            <div className="text-right">
              <div className="text-sm text-gray-600">
                Charges subtotal: <strong>{chargesTotal.toFixed(2)}</strong>
              </div>
              <div className="text-lg font-semibold">
                Grand total: <strong>{chargesTotal.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Notes / Terms / Payment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <label className="block mb-1 font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded h-32"
            />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <label className="block mb-1 font-medium">Terms & Conditions</label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full p-2 border rounded h-32"
            />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <label className="block mb-1 font-medium">Payment Details</label>
            <textarea
              value={paymentDetails}
              onChange={(e) => setPaymentDetails(e.target.value)}
              className="w-full p-2 border rounded h-32"
              placeholder="Bank / payment instructions"
            />
          </div>
        </div>

        {/* Signature & Stamp */}
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-2">Signature & Stamp (PDF Only)</h4>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="text-center">
              <label className="block mb-2">Upload Signature</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  fileToDataUrl(e.target.files?.[0] ?? null, setSignatureDataUrl)
                }
              />
              {signatureDataUrl && (
                <img
                  src={signatureDataUrl}
                  alt="signature"
                  className="h-20 mt-3 object-contain mx-auto"
                />
              )}
            </div>

            <div className="text-center">
              <label className="block mb-2">Upload Stamp</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  fileToDataUrl(e.target.files?.[0] ?? null, setStampDataUrl)
                }
              />
              {stampDataUrl && (
                <img
                  src={stampDataUrl}
                  alt="stamp"
                  className="h-20 mt-3 object-contain mx-auto"
                />
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">

          <button
            onClick={copyWhatsappStyle}
            className="px-4 py-2 rounded bg-green-700 text-white"
          >
            Copy Quotation
          </button>

          <button
            onClick={sendToWhatsapp}
            className="px-4 py-2 rounded bg-green-500 text-white"
          >
            Send to WhatsApp
          </button>

          <button
            onClick={exportPDF}
            className="px-4 py-2 rounded bg-red-500 text-white"
          >
            Download PDF
          </button>

          <button
            onClick={exportWord}
            className="px-4 py-2 rounded border"
          >
            Download Word
          </button>

        </div>
      </div>
    </div>
  );
}
