export default function AboutPage() {
    return (
      <div>
        <div className="mb-4 pb-4"></div>
        <section className="contact-us container">
          <div className="mw-930">
            <h2 className="page-title">About US</h2>
          </div>
  
          <div className="about-us__content pb-5 mb-5">
            <p className="mb-5">
              <img
                loading="lazy"
                className="w-100 h-auto d-block"
                src="/assets/app/images/about/about-1.jpg" // Đường dẫn đúng trong Next.js
                width="1410"
                height="550"
                alt="About Us"
              />
            </p>
            <div className="mw-930">
              <h3 className="mb-4">OUR STORY</h3>
              <p className="fs-6 fw-medium mb-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...
              </p>
              <p className="mb-4">
                Saw wherein fruitful good days image them, midst, waters upon, saw. Seas lights seasons...
              </p>
              <div className="row mb-3">
                <div className="col-md-6">
                  <h5 className="mb-3">Our Mission</h5>
                  <p className="mb-3">Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
                <div className="col-md-6">
                  <h5 className="mb-3">Our Vision</h5>
                  <p className="mb-3">Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
              </div>
            </div>
            <div className="mw-930 d-lg-flex align-items-lg-center">
              <div className="image-wrapper col-lg-6">
                <img
                  className="h-auto"
                  loading="lazy"
                  src="/assets/app/images/about/about-1.jpg" 
                  width="450"
                  height="500"
                  alt="Company"
                />
              </div>
              <div className="content-wrapper col-lg-6 px-lg-4">
                <h5 className="mb-3">The Company</h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet sapien dignissim a elementum...
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  