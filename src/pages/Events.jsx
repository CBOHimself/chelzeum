import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import events from "../data/events.json";
import EventGrid from "../components/EventGrid/EventGrid";
import Pagination from "../components/Pagination/Pagination";

const EVENTS_PER_PAGE = 4;

export default function Events() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(b.date) - new Date(a.date)),
    []
  );

  const totalPages = Math.max(1, Math.ceil(sortedEvents.length / EVENTS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * EVENTS_PER_PAGE;
    return sortedEvents.slice(start, start + EVENTS_PER_PAGE);
  }, [sortedEvents, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  function handleEventSelect(id) {
    navigate(`/events/${id}`);
  }

  return (
    <main className="events-page">
      <header className="art-page-header">
        <div>
          <p className="art-page-count">
            {String(sortedEvents.length).padStart(2, "0")} Events
          </p>
          <h1 className="art-page-title">Events</h1>
        </div>
      </header>

      <section className="events-hero-media">
        <div
          className="events-hero-placeholder"
          role="img"
          aria-label="Events banner image placeholder"
        >
          <span>Image Placeholder 4502 × 2534</span>
        </div>
      </section>

      <section className="events-content-section events-content-section--intro">
        <h2 className="events-content-heading">Workshops</h2>
        <p className="events-content-paragraph">
          Chelsea Sapphire Oware offers artist-led workshops rooted in her fine art
          practice. These sessions create space for reflection, storytelling, and
          creative expression, using painting as a tool for connection, self-exploration,
          and community engagement.
        </p>
        <p className="events-content-paragraph">
          Whether the session is hosted in a gallery, studio, or school setting,
          participants leave with actionable tools they can immediately apply in their
          own practice.
        </p>

        <h3 className="events-content-subheading">Workshop Focus</h3>
        <p className="events-content-paragraph">Chelsea's workshops often explore:</p>
        <ul className="events-content-bullets">
          <li>Identity and personal narrative</li>
          <li>Reclaiming stories through image making</li>
          <li>Emotional expression through colour and form</li>
          <li>Creativity as a tool for reflection and wellbeing</li>
        </ul>
        <p className="events-content-paragraph">
          Sessions are adapted for community groups, cultural programmes, and
          organisational settings.
        </p>
      </section>

      <section className="events-content-section">
        <h2 className="events-content-heading">Collaborations and Social Impact</h2>
        <p className="events-content-paragraph">
          Alongside her workshop practice, Chelsea has collaborated with charities and
          social enterprises through commissioned artworks to support fundraising
          initiatives. Her work has been used as part of charity raffles and prize draws,
          where audiences are invited to donate to a specific cause for the chance to win
          an original painting. These collaborations use art as a tool for engagement
          while directly supporting community-led and charitable outcomes.
        </p>
        <p className="events-content-paragraph">
          <strong>Experience:</strong> Odgers Berndtson's Corporate Social Responsibility
          Auction 2023 for the proceeds to be donated towards Cancer Research in the UK.
        </p>
      </section>

      <section className="events-content-section">
        <h2 className="events-content-heading">Approach</h2>
        <p className="events-content-paragraph">
          Chelsea's facilitation style is calm, inclusive, and reflective. Drawing on
          her background in social research and her self-taught artistic practice, she
          creates supportive environments where participants feel comfortable
          experimenting, sharing, and engaging at their own pace.
        </p>
        <p className="events-content-paragraph">
          Workshops can be delivered as one-off sessions or as part of wider cultural
          programmes and events.
        </p>
      </section>

      <section className="events-booking-form-wrap">
        <h2 className="events-content-heading">Private and Group Booking</h2>
        <p className="events-content-paragraph">
          To enquire about workshops or discuss a bespoke session, please use the form
          below.
        </p>
        <h3 className="events-content-subheading">Book a workshop</h3>
        <form
          className="events-booking-form"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/social");
          }}
        >
          <label className="events-form-field">
            <span>Your name</span>
            <input type="text" name="name" placeholder="Full name" required />
          </label>
          <label className="events-form-field">
            <span>Email</span>
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>
          <label className="events-form-field">
            <span>Workshop details</span>
            <textarea
              name="details"
              rows="4"
              placeholder="Tell us your preferred dates, audience size, and format."
            />
          </label>
          <button type="submit" className="events-contact-btn">
            Contact Us
          </button>
        </form>
      </section>

      <section className="events-content-section events-content-section--grid-heading">
        <h2 className="events-content-heading">Previous Workshops and Events</h2>
      </section>

      <EventGrid events={paginated} onSelect={handleEventSelect} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </main>
  );
}