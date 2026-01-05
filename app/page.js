import React from 'react';
import LogoutButton from './components/auth/LogoutButton';
import SlideShow from './components/home/SlideShow';
import FeaturedProducts from './components/home/FeaturedProducts';
import AdsSection from './components/home/AdsSection';
import BrandSection from './components/home/BrandSection';
const Home = () => {
  return (
    <main id="main-body-one-col" className="main-body">
    <section className="container-xxl my-4">
    <SlideShow  />
</section>

    <section className='container-xxl my-4'>
     <FeaturedProducts />
    </section>

    <section className='container-xxl my-4'>
      <AdsSection />
    </section>

    <section className='container-xxl my-4'>
   <BrandSection />
    </section>
    </main>
  );
};

export default Home;