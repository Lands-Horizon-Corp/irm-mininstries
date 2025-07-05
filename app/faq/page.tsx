import React from "react"

export default function FAQPage() {
  return (
    <main className='container mx-auto py-12 px-4'>
      <h1 className='text-3xl font-bold mb-6'>Frequently Asked Questions</h1>
      <div className='space-y-4'>
        <div>
          <h2 className='text-xl font-semibold'>Q: What is IRM Ministries?</h2>
          <p className='ml-4'>
            A: IRM Ministries is a faith-based organization dedicated to serving
            the community and spreading the message of hope.
          </p>
        </div>
        <div>
          <h2 className='text-xl font-semibold'>Q: How can I get involved?</h2>
          <p className='ml-4'>
            A: You can get involved by attending our events, volunteering, or
            contacting us through the website.
          </p>
        </div>
        {/* Add more FAQs as needed */}
      </div>
    </main>
  )
}
