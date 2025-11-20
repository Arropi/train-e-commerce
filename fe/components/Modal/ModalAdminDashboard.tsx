import { useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface OrderDetail {
  id: number;
  name: string;
  item: string;
  date: string;
  lab: string;
  serialNumber: string;
  purpose: string;
  session: string;
  borrower: string;
  room: string;
  personInCharge: string;
  condition: string;
  subject: string;
  image?: string;
}

interface ModalAdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetail | null;
}

export default function ModalAdminDashboard({
  isOpen,
  onClose,
  order,
}: ModalAdminDashboardProps) {
  // untuk biar tidak bisa discroll waktu modal dibuka
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflowY = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide relative border-2 border-[#004CB0]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* content */}
        <div className="p-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center">
              <Image
                src={order.image || "/images/logoUGM.png"}
                alt={order.item}
                width={96}
                height={96}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-shadow-gray-800 mb-2">
                {order.item}
              </h2>
              <p className="text-gray-600 font-medium">{order.serialNumber}</p>
            </div>
          </div>

          {/* detail grid */}
          <div className="space-y-6">
            {/* row 1, data dan lab */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Date</h3>
                <p className="text-gray-800">{order.date}</p>
              </div>
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Lab</h3>
                <p className="text-gray-800">{order.lab}</p>
              </div>
            </div>

            {/* row 2, purpose dan session */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Purpose</h3>
                <p className="text-gray-800">{order.purpose}</p>
              </div>
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Session</h3>
                <p className="text-gray-800">{order.session}</p>
              </div>
            </div>

            {/* row 3, borrower dan room */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Peminjam</h3>
                <p className="text-gray-800">{order.borrower}</p>
              </div>
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Ruang</h3>
                <p className="text-gray-800">{order.room}</p>
              </div>
            </div>

            {/* row 4, person in charge dan condition */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">
                  Person In Charge
                </h3>
                <p className="text-gray-800">{order.personInCharge}</p>
              </div>
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Condition</h3>
                <p
                  className={`font-medium ${
                    order.condition === "good"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.condition === "good" ? "Good" : "Bad"}
                </p>
              </div>
            </div>

            {/* row 5, action buttons */}
            <div>
              <h3 className="text-gray-600 font-semibold mb-1">Subject</h3>
              <p className="text-gray-800">{order.subject}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
