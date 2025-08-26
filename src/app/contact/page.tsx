import Form from "@/components/ContactUs/Form";
import Heading from "@/components/ContactUs/Heading";

export default function ContactPage() {
  return (
    <div className="contact_us__container bg-secondary-background my-16 flex flex-col justify-center">
      <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 -mt-16 h-screen w-full bg-radial-[ellipse_at_100%_0%] to-100%" />
      <div className="to-background/0 via-background/0 from-primary/20 absolute right-0 -z-10 h-screen w-full bg-radial-[ellipse_at_0%_50%] to-100%" />

      <Heading
        subHeader="Response Within 24 Hours"
        title="Contact us directly"
      />
      <div className="flex justify-center">
        <Form />
      </div>
    </div>
  );
}
