import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, HeartHandshake, Phone, PawPrint, ShieldCheck, Stethoscope } from 'lucide-react';

const Home = () => {
  return (
    <div className="px-3 pb-8 space-y-8">
      <section className="max-w-7xl mx-auto rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-secondary-50 to-primary-100 p-6 md:p-10 shadow-warm-lg overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-300/30 blur-3xl" />
        <div className="grid lg:grid-cols-2 gap-10 items-center relative">
          <div>
            <p className="text-primary-700 font-semibold mb-4">Animal Association Portfolio</p>
            <h1 className="text-4xl md:text-6xl font-bold text-dark-800 leading-tight">We rescue, heal, and protect animals with compassion.</h1>
            <p className="text-dark-500 mt-4 text-lg">A modern, transparent look at our daily rescue work, shelter care, and community impact.</p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link to="/donations" className="btn-primary inline-flex items-center justify-center gap-2">Support via PayPal <ArrowUpRight size={16} /></Link>
              <a href="tel:+15552367788" className="btn-secondary inline-flex items-center justify-center gap-2"><Phone size={16}/> Call to Help</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/logo.png" alt="logo" className="rounded-2xl bg-white p-4 shadow-warm h-40 w-full object-contain" />
            <div className="rounded-2xl bg-dark-900 text-white p-5"><p className="text-sm text-white/70">Animals rescued</p><p className="text-4xl font-bold">500+</p></div>
            <div className="col-span-2 rounded-2xl bg-white/90 border border-primary-100 p-5">
              <p className="text-dark-500 mb-3">Support options</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700">PayPal</span>
                <span className="px-3 py-1 rounded-full bg-secondary-100 text-dark-700">Phone Call</span>
                <span className="px-3 py-1 rounded-full bg-secondary-100 text-dark-700">Social Sharing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[{icon:PawPrint,title:'Street Rescue',text:'Rapid rescue operations in urgent cases.'},{icon:Stethoscope,title:'Medical Care',text:'Treatment, surgery, and recovery support.'},{icon:ShieldCheck,title:'Safe Shelter',text:'Clean and safe temporary housing.'},{icon:HeartHandshake,title:'Adoption',text:'Matching animals with loving families.'}].map((item)=>(
          <article key={item.title} className="rounded-2xl bg-white border border-primary-100 p-5 shadow-warm hover:-translate-y-1 transition">
            <item.icon className="text-primary-600 mb-3" />
            <h3 className="font-bold text-dark-700">{item.title}</h3>
            <p className="text-sm text-dark-500 mt-1">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="max-w-7xl mx-auto rounded-[28px] bg-dark-900 text-white p-8 md:p-10 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">Make a direct impact today.</h2>
          <p className="text-white/70 mt-3">Every donation funds food, treatment, vaccines, and emergency rescues.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
          <Link to="/donations" className="bg-primary-500 hover:bg-primary-600 px-6 py-3 rounded-xl font-semibold text-center">Donate Now</Link>
          <Link to="/contact" className="bg-white text-dark-800 px-6 py-3 rounded-xl font-semibold text-center">Contact Team</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
