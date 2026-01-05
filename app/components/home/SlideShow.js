import Image from 'next/image';
import React from 'react';

const SlideShow = () => {
    return (
        <section className="row">
                <section className="col-md-8 pe-md-1 ">
                    <section id="slideshow" className="owl-carousel owl-theme">
                        <section className="item"><a className="w-100 d-block h-auto text-decoration-none" href="#">
                        <Image src="/images/slideshow/1.jpg" alt='Slide 1' width={800} height={400} className='w-100 rounded-2' />

                                    </a></section>
                        <section className="item"><a className="w-100 d-block h-auto text-decoration-none" href="#">
                        <Image src="/images/slideshow/2.jpg" alt='Slide 2' width={800} height={400} className='w-100 rounded-2' />


                                    </a></section>
                        <section className="item"><a className="w-100 d-block h-auto text-decoration-none" href="#">
                        <Image src="/images/slideshow/3.jpg" alt='Slide 3' width={800} height={400} className='w-100 rounded-2' />

                                    </a></section>
                        <section className="item"><a className="w-100 d-block h-auto text-decoration-none" href="https://fa.piliapp.com/random/wheel/">
                        <Image src="/images/slideshow/4.jpg" alt='Slide 4' width={800} height={400} className='w-100 rounded-2' />

                                    </a></section>
                        <section className="item"><a className="w-100 d-block h-auto text-decoration-none" href="#">
                        <Image src="/images/slideshow/5.jpg" alt='Slide 5' width={800} height={400} className='w-100 rounded-2' />
                        

                                    </a></section>
                        <section className="item"><a className="w-100 d-block h-auto text-decoration-none" href="#">
                        <Image src="/images/slideshow/6.gif" alt='Slide 6' width={800} height={400} className='w-100 rounded-2' />
                        

                                    </a></section>
                    </section>
                </section>
                <section className="col-md-4 ps-md-1 mt-2 mt-md-0">
                    <section className="mb-2"><a href="https://www.mydigipay.com/" className="d-block"  target="_blank">
                        <Image src="/images/slideshow/12.gif" alt='Slide 12' width={400} height={200} className='w-100 rounded-2' />
                 

                                </a></section>
                    <section className="mb-2"><a href="https://www.digistyle.com/" className="d-block"  target="_blank" rel="noopener noreferrer">
                        <Image src="/images/slideshow/11.jpg" alt='Slide 11' width={400} height={200} className='w-100 rounded-2' />
               

                                </a></section>
                </section>
            </section>
    );
};

export default SlideShow;