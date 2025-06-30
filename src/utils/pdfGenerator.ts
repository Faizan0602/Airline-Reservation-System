import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Booking } from '../types';

export const generateTicketPDF = async (booking: Booking): Promise<void> => {
  // Create a temporary div with the ticket content
  const ticketElement = document.createElement('div');
  ticketElement.style.position = 'absolute';
  ticketElement.style.left = '-9999px';
  ticketElement.style.width = '800px';
  ticketElement.style.padding = '40px';
  ticketElement.style.backgroundColor = 'white';
  ticketElement.style.fontFamily = 'Arial, sans-serif';

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  ticketElement.innerHTML = `
    <div style="border: 2px solid #2563eb; border-radius: 12px; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
          </svg>
          <h1 style="font-size: 28px; font-weight: bold; margin: 0;">SkyWays Airlines</h1>
        </div>
        <p style="font-size: 18px; margin: 0; opacity: 0.9;">Electronic Ticket</p>
      </div>

      <!-- Booking Reference -->
      <div style="background: #f8fafc; padding: 20px; border-bottom: 1px solid #e2e8f0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: bold; margin: 0 0 5px 0; color: #1e40af;">Booking Reference</h2>
            <p style="font-size: 24px; font-weight: bold; margin: 0; color: #1e40af;">${booking.bookingReference}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; color: #64748b;">Total Amount</p>
            <p style="font-size: 24px; font-weight: bold; margin: 0; color: #1e40af;">${formatPrice(booking.totalAmount)}</p>
          </div>
        </div>
      </div>

      <!-- Flight Details -->
      <div style="padding: 30px;">
        <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 20px 0; color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Flight Information</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
          <div>
            <div style="margin-bottom: 15px;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Flight Number</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${booking.flight.flightNumber}</p>
            </div>
            <div style="margin-bottom: 15px;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Airline</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${booking.flight.airline}</p>
            </div>
            <div style="margin-bottom: 15px;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Aircraft</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${booking.flight.aircraft}</p>
            </div>
          </div>
          
          <div>
            <div style="margin-bottom: 15px;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Departure</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${booking.flight.origin.city} (${booking.flight.origin.code})</p>
              <p style="margin: 0; color: #64748b; font-size: 14px;">${formatDateTime(booking.flight.departureTime)}</p>
            </div>
            <div style="margin-bottom: 15px;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Arrival</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${booking.flight.destination.city} (${booking.flight.destination.code})</p>
              <p style="margin: 0; color: #64748b; font-size: 14px;">${formatDateTime(booking.flight.arrivalTime)}</p>
            </div>
          </div>
        </div>

        <!-- Passengers -->
        <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 20px 0; color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Passenger Information</h3>
        
        <div style="margin-bottom: 30px;">
          ${booking.passengers.map((passenger, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8fafc; margin-bottom: 10px; border-radius: 8px;">
              <div>
                <p style="margin: 0; font-weight: bold; font-size: 16px;">${passenger.title} ${passenger.firstName} ${passenger.lastName}</p>
                <p style="margin: 0; color: #64748b; font-size: 14px;">${passenger.email}</p>
              </div>
              ${booking.seats[index] ? `
                <div style="text-align: right;">
                  <p style="margin: 0; font-weight: bold;">Seat ${booking.seats[index].seatNumber}</p>
                  <p style="margin: 0; color: #64748b; font-size: 14px; text-transform: capitalize;">${booking.seats[index].class}</p>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Important Information -->
        <div style="background: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px; padding: 20px;">
          <h4 style="font-weight: bold; color: #1e40af; margin: 0 0 10px 0;">Important Information</h4>
          <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.6;">
            <li>Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights</li>
            <li>Check-in opens 24 hours before departure</li>
            <li>Bring a valid ID and passport (for international flights)</li>
            <li>Review baggage allowances on our website</li>
            <li>This is an electronic ticket. Please present this document at check-in</li>
          </ul>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 12px;">
            Generated on ${new Date().toLocaleString()} | SkyWays Airlines | www.skyways.com
          </p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(ticketElement);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(ticketElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Download the PDF
    pdf.save(`SkyWays-Ticket-${booking.bookingReference}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    // Clean up
    document.body.removeChild(ticketElement);
  }
};

export const generateSimplePDF = (booking: Booking): void => {
  const pdf = new jsPDF();
  
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Header
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SkyWays Airlines', 20, 30);
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Electronic Ticket', 20, 40);

  // Booking Reference
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Booking Reference:', 20, 60);
  pdf.setFont('helvetica', 'normal');
  pdf.text(booking.bookingReference, 80, 60);

  // Flight Details
  pdf.setFont('helvetica', 'bold');
  pdf.text('Flight Information:', 20, 80);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Flight: ${booking.flight.flightNumber}`, 20, 95);
  pdf.text(`Airline: ${booking.flight.airline}`, 20, 105);
  pdf.text(`Aircraft: ${booking.flight.aircraft}`, 20, 115);
  
  pdf.text(`From: ${booking.flight.origin.city} (${booking.flight.origin.code})`, 20, 130);
  pdf.text(`Departure: ${formatDateTime(booking.flight.departureTime)}`, 20, 140);
  
  pdf.text(`To: ${booking.flight.destination.city} (${booking.flight.destination.code})`, 20, 155);
  pdf.text(`Arrival: ${formatDateTime(booking.flight.arrivalTime)}`, 20, 165);

  // Passengers
  pdf.setFont('helvetica', 'bold');
  pdf.text('Passengers:', 20, 185);
  
  let yPos = 200;
  booking.passengers.forEach((passenger, index) => {
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${index + 1}. ${passenger.title} ${passenger.firstName} ${passenger.lastName}`, 20, yPos);
    if (booking.seats[index]) {
      pdf.text(`Seat: ${booking.seats[index].seatNumber} (${booking.seats[index].class})`, 120, yPos);
    }
    yPos += 10;
  });

  // Total Amount
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Total Amount: ${formatPrice(booking.totalAmount)}`, 20, yPos + 20);

  // Footer
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on ${new Date().toLocaleString()}`, 20, 280);

  // Download
  pdf.save(`SkyWays-Ticket-${booking.bookingReference}.pdf`);
};