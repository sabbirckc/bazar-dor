const Footer = () => {
  return (
    <footer className="border-t border-[#E1EAE2] bg-[#FAFCFA]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-center text-[10px] leading-5 text-[#68736A] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-xs lg:px-8">
        {/* Short site tagline */}
        <p>বাজার দর — নিত্যপ্রয়োজনীয় পণ্যের দাম এক নজরে।</p>

        {/* Disclaimer note */}
        <p>সকল দাম সর্বশেষ তথ্যের ভিত্তিতে পরিবর্তিত হয়।</p>
      </div>
    </footer>
  );
};

export default Footer;