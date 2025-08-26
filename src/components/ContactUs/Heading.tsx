type TProps = {
  subHeader: string;
  title: string;
};

export default function ContactUsHeading({ title, subHeader }: TProps) {
  return (
    <div className="heading__container px-5 pt-8 pb-6 text-center md:px-0 md:pt-15 md:pb-10">
      <div className="mb-2 text-2xl font-bold md:mb-0 md:text-3xl">{title}</div>
      <div className="text-sm font-normal text-gray-600 md:text-base">
        {subHeader}
      </div>
    </div>
  );
}
