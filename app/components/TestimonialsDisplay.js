'use client';

export default function TestimonialsDisplay({ testimonials }) {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          No testimonials yet. Be the first to share your experience!
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {testimonials.map((testimonial, index) => (
        <div
          key={testimonial._id || index}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {testimonial.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">
                {testimonial.name}
              </h4>
              <p className="text-gray-400 text-sm">
                {new Date(testimonial.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className="text-gray-300 italic">"{testimonial.message}"</p>
          <div className="mt-4 flex text-yellow-400">{'★'.repeat(5)}</div>
        </div>
      ))}
    </div>
  );
}
