import React from 'react';

const Testimonials = () => {
  return (
    <section className="sp-bg" id="testimonials">
      <div className="section-inner">
        <div className="section-head reveal reveal-up">
          <div className="section-chip">✦ Reviews</div>
          <h2 className="section-title">Loved by <span>Local Shops</span> Everywhere</h2>
          <p className="section-sub">Shopkeepers across India trust LedgerKart to manage their customer dues smartly.</p>
        </div>
        <div className="sp-grid reveal-stagger">
          <div className="sp-card">
            <div className="sp-stars"><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span></div>
            <p className="sp-text">&quot;LedgerKart completely transformed how I manage my Kirana shop. No more paper khatas, no more fights over dues. My customers love checking their balance on their phone!&quot;</p>
            <div className="sp-author">
              <div className="sp-av av-indigo">RG</div>
              <div>
                <div className="sp-name">Rajan Gupta</div>
                <div className="sp-role">Gupta Kirana Store, Delhi</div>
              </div>
            </div>
          </div>
          <div className="sp-card">
            <div className="sp-stars"><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span></div>
            <p className="sp-text">&quot;The WhatsApp reminder feature is a game-changer. I recovered ₹40,000 in pending dues in the first month just by enabling automated reminders. Incredible tool!&quot;</p>
            <div className="sp-author">
              <div className="sp-av av-green">SP</div>
              <div>
                <div className="sp-name">Sunita Patel</div>
                <div className="sp-role">SP Medical & General, Surat</div>
              </div>
            </div>
          </div>
          <div className="sp-card">
            <div className="sp-stars"><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span></div>
            <p className="sp-text">&quot;As a hardware shop owner managing 200+ customers, LedgerKart is a lifesaver. The monthly PDF khata report helps me during tax time. Highly recommend to all shop owners.&quot;</p>
            <div className="sp-author">
              <div className="sp-av av-red">MK</div>
              <div>
                <div className="sp-name">Mahesh Khandelwal</div>
                <div className="sp-role">Khandelwal Hardware, Jaipur</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
