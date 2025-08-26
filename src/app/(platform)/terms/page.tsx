import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export default function TermsAndConditions() {
  return (
    <div className="">
      <Container>
        <div className="py-[30px] md:py-24">
          <Heading
            align="left"
            className="mb-8"
            description="Effective Date: 26 August 2025"
            title="Terms and Conditions"
          />
          <div className="prose max-w-none">
            <p className="mb-8 text-gray-600">
              Welcome to IRM Ministries (International Revival Ministries), a
              Christian ministry organization (&quot;we,&quot; &quot;us,&quot;
              &quot;our&quot;).
            </p>
            <p className="mb-8 text-gray-600">
              These Terms and Conditions govern your participation in our
              ministry, use of our services, and ministry with IRM Ministries.
            </p>
            <p className="mb-8 text-gray-600">
              By joining our ministry or using our website, you agree to these
              Terms.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">1. Ministry Purpose</h3>
            <p className="mb-8 text-gray-600">
              IRM Ministries is a Christian organization dedicated to spreading
              the Gospel, building faith communities, and providing spiritual
              support to believers worldwide. We are committed to Biblical
              teachings and Christian values.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              2. ministry Requirements
            </h3>
            <p className="mb-8 text-gray-600">
              ministry with IRM Ministries is open to all individuals who accept
              Jesus Christ as their Lord and Savior. Ministers agree to uphold
              Christian values, participate actively in ministry activities, and
              support the mission of spreading God&apos;s love.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              3. Donations and Tithes
            </h3>
            <p className="mb-8 text-gray-600">
              All donations and tithes to IRM Ministries are voluntary offerings
              given to support our ministry work. These contributions are used
              for evangelical activities, community support, and ministry
              operations. We practice financial transparency and stewardship.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">4. Ministry Services</h3>
            <p className="mb-8 text-gray-600">
              We provide various ministry services including worship services,
              Bible study sessions, prayer meetings, counseling, community
              outreach programs, and educational resources. All services are
              provided in accordance with Biblical principles.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">5. Code of Conduct</h3>
            <p className="mb-8 text-gray-600">
              All Ministers are expected to conduct themselves in a manner
              consistent with Christian teachings. This includes showing love,
              respect, and compassion toward others, maintaining integrity, and
              avoiding behaviors that contradict Biblical principles.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              6. Limitation of Liability
            </h3>
            <p className="mb-8 text-gray-600">
              IRM Ministries provides spiritual guidance and support based on
              Biblical teachings. We are not responsible for individual
              decisions made by Ministers or outcomes resulting from personal
              choices. Ministers participate in ministry activities at their own
              discretion.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              7. Privacy and Confidentiality
            </h3>
            <p className="mb-8 text-gray-600">
              We respect the privacy of our Ministers and maintain
              confidentiality of personal information shared during counseling
              sessions, prayer requests, and ministry interactions. Information
              is used solely for ministry purposes and spiritual support.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              8. ministry Termination
            </h3>
            <p className="mb-8 text-gray-600">
              Ministers may voluntarily withdraw from the ministry at any time
              by:
            </p>
            <ul className="mb-8 list-disc space-y-2 pl-5">
              <li>
                Providing written notice to ministry leadership expressing their
                intention to discontinue ministry.
              </li>
              <li>
                Understanding that ministry benefits and privileges will cease.
              </li>
              <li>
                Recognizing that donations made are non-refundable as they
                support ongoing ministry work.
              </li>
            </ul>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              9. Contact and Support
            </h3>
            <p className="mb-8 text-gray-600">
              For questions, concerns, or support needs, please contact us at
              info@irmministries.org or through our website contact form. Our
              ministry leaders are available to provide guidance and assistance.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">10. Changes to Terms</h3>
            <p className="mb-8 text-gray-600">
              IRM Ministries reserves the right to update these Terms and
              Conditions as our ministry grows and evolves. Ministers will be
              notified of significant changes, and continued participation
              constitutes acceptance of updated terms.
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">
              11. Doctrinal Statement
            </h3>
            <p className="mb-8 text-gray-600">
              IRM Ministries adheres to fundamental Christian doctrines
              including:
              <br />
              • The authority and inspiration of the Holy Bible
              <br />
              • The Trinity: Father, Son, and Holy Spirit
              <br />
              • Salvation through faith in Jesus Christ alone
              <br />• The Great Commission to make disciples of all nations
            </p>
            <Separator className="my-8" />
            <h3 className="mb-3 text-lg font-semibold">12. Agreement</h3>
            <p className="mb-8 text-gray-600">
              By participating in IRM Ministries, you acknowledge that you have
              read, understood, and agree to these Terms and Conditions. You
              also affirm your commitment to supporting our ministry mission and
              living according to Christian principles.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
