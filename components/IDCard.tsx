
import React from 'react';
import { Person } from '../types';
import Barcode from './Barcode';

interface IDCardProps {
  person: Person;
}

const IDCard: React.FC<IDCardProps> = ({ person }) => {
  const isCrew = person.role?.toUpperCase() === 'CREW';
  const titleTR = isCrew ? 'GEÇİCİ GİRİŞ BELGESİ (MÜRETTEBAT)' : 'GEÇİCİ GİRİŞ BELGESİ (YOLCU)';
  const titleEN = isCrew ? 'ISTANBUL LANDING CARD (CREW)' : 'ISTANBUL LANDING CARD (PASSENGER)';

  return (
    <div className="w-[210mm] h-[148mm] bg-white border border-gray-400 p-8 flex flex-col font-sans text-black overflow-hidden shadow-lg relative" style={{ boxSizing: 'border-box' }}>
      <div className="flex flex-row h-full">
        
        {/* SOL SÜTUN: Veri Tablosu ve Barkod */}
        <div className="w-[58%] flex flex-col pr-6 border-r border-gray-200">
          <div className="text-center mb-4">
            <div className="text-[12px] font-black leading-tight uppercase">
              <p>{titleTR}</p>
              <p>{titleEN}</p>
            </div>
          </div>

          <table className="w-full border-collapse border-[1.5px] border-black text-[13px]">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1.5 w-[45%] font-black leading-tight align-top">
                  Gemi Adı:<br/>
                  <span className="text-[11px] font-bold">Ship’s Name:</span>
                </td>
                <td className="border border-black px-3 py-1.5 text-center font-bold text-[15px] uppercase align-middle">{person.vesselName || 'HEBRIDEAN SKY'}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-black leading-tight align-top">
                  Bandırası:<br/>
                  <span className="text-[11px] font-bold">Flag:</span>
                </td>
                <td className="border border-black px-3 py-1.5 text-center font-bold uppercase align-middle">{person.flag || 'BAHAMAS'}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-black leading-tight align-top">
                  Gemi Geliş Tarihi:<br/>
                  <span className="text-[11px] font-bold">Ship's Arrival Date:</span>
                </td>
                <td className="border border-black px-3 py-1.5 text-center font-bold align-middle">{person.arrivalDate}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-black leading-tight align-top">
                  Gemi Gidiş Tarihi:<br/>
                  <span className="text-[11px] font-bold">Ship's Departure Date:</span>
                </td>
                <td className="border border-black px-3 py-1.5 text-center font-bold align-middle">{person.departureDate}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-black leading-tight align-top">
                  Soyadı:<br/>
                  <span className="text-[11px] font-bold">Surname:</span>
                </td>
                <td className="border border-black px-3 py-1.5 text-center font-bold uppercase text-[16px] align-middle">{person.lastName}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-black leading-tight align-top">
                  Adı:<br/>
                  <span className="text-[11px] font-bold">Name:</span>
                </td>
                <td className="border border-black px-3 py-1.5 text-center font-bold uppercase text-[16px] align-middle">{person.firstName}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-black leading-tight align-top">
                  Uyruk:<br/>
                  <span className="text-[11px] font-bold">Nationality:</span>
                </td>
                <td className="border border-black px-3 py-1.5 text-center font-bold uppercase align-middle">{person.nationality}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-black leading-tight align-top">
                  Pasaport No:<br/>
                  <span className="text-[11px] font-bold">Passport No:</span>
                </td>
                <td className="border border-black px-3 py-1.5 text-center font-bold uppercase align-middle">{person.passportNo}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-black leading-tight align-top">
                  Kabin No / Diğer:<br/>
                  <span className="text-[11px] font-bold">Cabin No / Other :</span>
                </td>
                <td className="border border-black px-3 py-1.5 text-center font-bold uppercase align-middle">{person.cabinNo || '-'}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 flex flex-col items-center">
            <div className="border border-black p-2 bg-white w-full">
              <Barcode value={person.barcodeValue} height={18} />
            </div>
          </div>
        </div>

        {/* SAĞ SÜTUN: Yasal Metinler */}
        <div className="w-[42%] text-[10.5px] leading-[1.3] pl-6 flex flex-col justify-between">
          <div className="space-y-4 text-justify">
            <div className="flex gap-2">
              <span className="font-black flex-shrink-0">1)</span>
              <p>
                Bu yolcu/mürettebat "Geçici Giriş Belgesi" Pasaport kanununun 6.maddesine istinaden tanzim edilmiştir. 
                <span className="block mt-0.5 text-gray-800 font-medium italic">(This "Temporary Entry Document / Landing Card" complies with Article 6 of the Passport Law.)</span>
              </p>
            </div>
            <div className="flex gap-2">
              <span className="font-black flex-shrink-0">2)</span>
              <p>
                Bu kart, ismi yazılı yolcu(nun)/mürettebat(ın) kartta yazılı geminin İstanbul limanında bulunduğu süre içerisinde 
                İstanbul sınırları dahilinde şehri gezmesine ve burada geceleyebilmesi ile limanlara girip çıkma izni içerir. 
                Liman şehri dışına çıkma izni içermez. 
                <span className="block mt-0.5 text-gray-800 font-medium italic">(This landing card is intended for passengers and crew members whose names written on it, during the time the ship is docked in Istanbul port. It grants permission to visit any location within the borders of Istanbul, stay overnight, and enter and exit ports. However, it does not provide permissions to leave the port city.)</span>
              </p>
            </div>
            <div className="flex gap-2">
              <span className="font-black flex-shrink-0">3)</span>
              <p>
                <span className="font-black">Bu belgenin doğrulanması, kaybedilmesi veya bulunması halinde</span> Deniz Liman Şube Müdürlüğü ile 
                <span className="font-black"> +90 505 318 3413</span> üzerinden irtibata geçiniz. 
                <span className="block mt-0.5 text-gray-800 font-medium italic">(In case of document verification, loss, or theft, please contact the Sea Port Branch Office at +90 505 318 3413)</span>
              </p>
            </div>
          </div>

          <div className="mt-auto pt-6 text-center border-t border-gray-100">
            <p className="font-black text-[11px] mb-1">Geminin Yetkili Acentesi</p>
            <p className="text-[10px] font-medium">Ship's Authorized Agency Contact No:</p>
            <p className="text-[14px] font-black text-blue-900">+90 531 696 79 82</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCard;
