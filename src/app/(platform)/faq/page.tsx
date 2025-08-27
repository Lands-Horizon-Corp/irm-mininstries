"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const faqData = [
  {
    category: "About IRM Ministries",
    questions: [
      {
        answer:
          "IRM Ministries (Intentional Redeeming Ministries) is a Christian church organization in the Philippines dedicated to the redemption and transformation of nations. We are a community rooted in God's Word, united in prayer, and committed to fulfilling the Great Commission.",
        question: "What is IRM Ministries?",
      },
      {
        answer:
          "Mission: We exist to glorify God by obeying the Great Commandment and fulfilling the Great Commission. Vision: Redemption and Transformation of Nations.",
        question: "What is your mission and vision?",
      },
      {
        answer:
          "Our core values include: Loving God, Personal Holiness, Loving people, Servant Leadership, Spirit-led Ministry, Holistic Mission, and Shared Resources. These values guide everything we do as a ministry community.",
        question: "What are IRM Ministries' core values?",
      },
      {
        answer:
          "Our main church is located at 351 Tandang Sora Avenue, Pasong Tamo, Quezon City, Philippines. We also have various church locations and are continuing to expand to serve more communities.",
        question: "Where is IRM Ministries located?",
      },
      {
        answer:
          "IRM Ministries has a National Church Council led by Bishop Nehemias R. Martin as General Superintendent, along with other dedicated leaders including Assistant General Superintendent, General Secretary, and General Treasurer.",
        question: "What is your leadership structure?",
      },
    ],
  },
  {
    category: "Our Beliefs",
    questions: [
      {
        answer:
          "We believe in one true and living God, the Creator and Sustainer of all things. He is eternally existing in 3 distinct persons – God the Father, God the Son (Jesus Christ), and the Holy Spirit. We affirm the Trinity as fundamental to our Christian faith.",
        question: "What do you believe about God?",
      },
      {
        answer:
          "We believe in Jesus Christ, the eternal Son of God who became man without ceasing to be God. He was conceived by the Holy Spirit and born of the Virgin Mary, possessing two natures: fully God and fully man. Jesus died for our sins, rose again on the third day, and will return to judge the living and the dead.",
        question: "What do you believe about Jesus Christ?",
      },
      {
        answer:
          "We believe that salvation is a grace from God made available through the finished work of Jesus Christ on the cross. It is received upon repentance and faith in Him alone, apart from any good works, religious ceremonies, or human merit.",
        question: "What do you believe about salvation?",
      },
      {
        answer:
          "We believe the Bible is God's inspired and authoritative Word, providing guidance for faith and life. As a community rooted in God's Word, we study Scripture together and apply its teachings in our daily lives.",
        question: "What do you believe about the Bible?",
      },
      {
        answer:
          "Yes, we believe Christ instituted two ordinances for the Church: Baptism, which symbolizes the believer's union with Christ in His death, burial, and resurrection, and the Lord's Supper, observed in remembrance of Christ's death until He comes.",
        question: "Do you believe in baptism and communion?",
      },
      {
        answer:
          "Yes, we believe in the certainty of Christ's second coming. It will be physical, visible, and personal to establish His rule over all things. This hope motivates us to live holy lives and be faithful stewards.",
        question: "Do you believe in Christ's second coming?",
      },
      {
        answer:
          "The Great Commandment is to love God with all your heart, soul, and mind, and love your neighbor as yourself (Matthew 22:37-39). The Great Commission is Jesus' command to make disciples of all nations (Matthew 28:19-20). These are central to our ministry.",
        question: "What is the Great Commission and Great Commandment?",
      },
    ],
  },
  {
    category: "ministry & Joining",
    questions: [
      {
        answer:
          "Anyone who believes in Jesus Christ as their personal Savior and Lord is welcome to join our ministry family. There are no barriers – come as you are. We welcome people from all backgrounds who desire to grow in their relationship with God.",
        question: "Who can join IRM Ministries?",
      },
      {
        answer:
          "The process is simple: Fill out our ministry form with your personal details, upload required documents (photo and identification), and wait for our ministry leaders to contact you personally to welcome you into our church family.",
        question: "How do I become a one of the ministries of IRM Ministries?",
      },
      {
        answer:
          "You'll need to provide a recent photo, valid identification, and any relevant ministry certificates or training credentials you may have. Our form will guide you through the specific requirements.",
        question: "What documents do I need to provide for ministry?",
      },
      {
        answer:
          "After submitting your information, our ministry leaders will personally review your application and contact you to welcome you into our church family and guide your next steps in your spiritual journey with us.",
        question: "What happens after I apply for ministry?",
      },
    ],
  },
  {
    category: "Church Life & Services",
    questions: [
      {
        answer:
          "Yes, we conduct regular worship services where we gather as a community to worship God, study His Word, and fellowship together. We believe in the importance of corporate worship and community life.",
        question: "Do you have worship services?",
      },
      {
        answer:
          "We offer various Christian ministries and programs designed to help believers grow in their faith, serve others, and participate in God's mission. These include discipleship programs, community outreach, and Spirit-led ministry activities.",
        question: "What ministries and programs do you offer?",
      },
      {
        answer:
          "Yes, we gratefully accept donations and offerings to support our ministry work, community outreach, and church operations. These help us continue our mission of redemption and transformation of nations.",
        question: "Do you accept donations or offerings?",
      },
      {
        answer:
          "You can reach us at our main church location at 351 Tandang Sora Avenue, Quezon City, Philippines, or call (02) 8951 7975. You can also visit our website or use our contact form for inquiries about faith, ministry, or our community.",
        question: "How can I contact IRM Ministries?",
      },
    ],
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  question: string;
}) {
  return (
    <Card className="mb-4 transition-all duration-200 hover:shadow-md">
      <CardHeader className="cursor-pointer pb-4" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <h3 className="text-foreground pr-4 text-lg font-semibold">
            {question}
          </h3>
          {isOpen ? (
            <ChevronUp className="text-muted-foreground h-5 w-5 flex-shrink-0" />
          ) : (
            <ChevronDown className="text-muted-foreground h-5 w-5 flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0 pb-6">
          <Separator className="mb-4" />
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </CardContent>
      )}
    </Card>
  );
}

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header Section */}
      <div className="from-primary/10 via-primary/5 to-background w-full bg-gradient-to-r py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold lg:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed">
            Welcome to the IRM Ministries FAQ page! Here you will find answers
            to common questions about our ministry, beliefs, ministry, and how
            to join our faith community.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {faqData.map((category, categoryIndex) => (
            <div className="mb-12" key={categoryIndex}>
              <h2 className="text-foreground border-primary/20 mb-6 border-b-2 pb-2 text-2xl font-bold">
                {category.category}
              </h2>
              <div className="space-y-2">
                {category.questions.map((item, questionIndex) => (
                  <AccordionItem
                    answer={item.answer}
                    isOpen={
                      openItems[`${categoryIndex}-${questionIndex}`] || false
                    }
                    key={questionIndex}
                    question={item.question}
                    onToggle={() => toggleItem(categoryIndex, questionIndex)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Contact Section */}
          <Card className="bg-primary/5 border-primary/20 mt-16">
            <CardContent className="p-8 text-center">
              <h3 className="text-foreground mb-4 text-xl font-bold">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6">
                Contact us at our church office or visit our contact page for
                further assistance. We&apos;re here to help you on your
                spiritual journey and answer any questions about faith,
                ministry, or our ministry community.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <div className="text-sm">
                  <strong>Phone:</strong> (02) 8951 7975
                </div>
                <div className="text-muted-foreground hidden sm:block">|</div>
                <div className="text-sm">
                  <strong>Address:</strong> 351 Tandang Sora Ave, Quezon City
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
