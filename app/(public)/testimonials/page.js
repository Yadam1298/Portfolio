import { connectDB } from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import TestimonialsDisplay from '@/app/components/TestimonialsDisplay';
import TestimonialsFormToggle from '@/app/components/TestimonialsFormToggle'; // ✅ NEW

export default async function TestimonialsPage() {
  let testimonials = [];

  try {
    await connectDB();

    testimonials = await Testimonial.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .lean();

    testimonials = testimonials.map((t) => ({
      ...t,
      _id: t._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 mt-[70px]">
      <h1 className="text-3xl font-bold text-white text-center">
        What People Say
      </h1>

      {/* Testimonials List */}
      <TestimonialsDisplay testimonials={testimonials} />

      {/* Divider */}
      <div className="border-t border-gray-700 pt-10" />

      {/* ✅ FORM TOGGLE COMPONENT */}
      <TestimonialsFormToggle />
    </div>
  );
}
