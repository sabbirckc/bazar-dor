
"use client";

import toast from "react-hot-toast";

export default function ToastTest() {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      <button
        type="button"
        onClick={() => toast.success("সফলভাবে সম্পন্ন হয়েছে!")}
        className="rounded-lg bg-[#07883F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#066F34]"
      >
        Test Success Toast
      </button>

      <button
        type="button"
        onClick={() => toast.error("কিছু একটা সমস্যা হয়েছে!")}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Test Error Toast
      </button>
    </div>
  );
}
