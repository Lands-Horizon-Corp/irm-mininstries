import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FaqSection() {
  const faqs = [
    {
      answer:
        "Anyone who believes in Jesus Christ as their personal Savior and Lord is welcome to join our ministry family. There are no barriers - come as you are.",
      question: "Who can join IRM Ministries?",
    },
    {
      answer:
        "Simply fill out our ministry form with your personal details, upload required documents (photo and ID), and wait for our ministry leaders to contact you personally.",
      question: "How do I become a Minister?",
    },
    {
      answer:
        "Our mission is the Redemption and Transformation of Nations. We exist to glorify God by obeying the Great Commandment and fulfilling the Great Commission.",
      question: "What is IRM Ministries' mission?",
    },
    {
      answer:
        "Our core values include Loving God, Personal Holiness, Loving people, Servant Leadership, Spirit-led Ministry, Holistic Mission, and Shared Resources.",
      question: "What are your core values?",
    },
    {
      answer:
        "We believe in the Trinity - God the Father, Jesus Christ as fully God and fully man, and the Holy Spirit. We believe in salvation by grace through faith in Jesus Christ alone.",
      question: "What do you believe about God and salvation?",
    },
    {
      answer:
        "We are a welcoming community rooted in God's Word, united in prayer, and committed to transforming lives through intentional discipleship and servant leadership.",
      question: "What kind of community is IRM Ministries?",
    },
    {
      answer:
        "After submitting your information, our ministry leaders will personally review your application and contact you to welcome you into our church family and guide your next steps.",
      question: "What happens after I apply for ministry?",
    },
    {
      answer:
        "Contact us through our website contact form or reach out to our ministry leaders. We're here to answer any questions about faith, ministry, or our community.",
      question: "How can I get more information or support?",
    },
  ];

  return (
    <section className="py-2 md:py-16">
      <div className="to-background/0 via-background/0 from-primary/20 absolute right-0 -z-10 h-full w-full animate-pulse bg-radial-[ellipse_at_-20%_50%] to-10%" />
      <div className="to-background/0 via-background/0 from-primary/20 absolute right-0 -z-10 h-full w-full animate-pulse bg-radial-[ellipse_at_100%_50%] to-10%" />

      <div className="container mx-auto px-4">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="text-foreground mb-8 text-left text-2xl font-bold md:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-4 md:gap-6">
            {faqs.map((faq, index) => (
              <Card
                className="group transform-gpu shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
                key={index}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-sm md:text-base">
                    {faq.answer}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
