import { Icon } from "@/components/icon";

export function LearningIllustration() {
  return (
    <div
      aria-label="Illustration of digital learning with a laptop, study materials, and a connected learning card"
      className="learning-illustration"
      role="img"
    >
      <div className="illustration-orbit orbit-one" />
      <div className="illustration-orbit orbit-two" />
      <div className="illustration-dot dot-one" />
      <div className="illustration-dot dot-two" />
      <div className="learning-card">
        <span className="learning-card-icon"><Icon name="book" /></span>
        <span>
          <strong>Learning, your way</strong>
          <small>Knowledge without boundaries</small>
        </span>
        <span className="learning-card-check"><Icon name="check" /></span>
      </div>
      <div className="book-stack">
        <span className="book book-back" />
        <span className="book book-middle" />
        <span className="book book-front" />
        <span className="book-pages" />
      </div>
      <div className="plant">
        <span className="plant-leaf leaf-left" />
        <span className="plant-leaf leaf-right" />
        <span className="plant-leaf leaf-top" />
        <span className="plant-stem" />
        <span className="plant-pot" />
      </div>
      <div className="laptop">
        <div className="laptop-screen">
          <div className="screen-topline"><span /><span /><span /></div>
          <div className="screen-content">
            <span className="screen-emblem"><Icon name="cap" /></span>
            <span className="screen-line screen-line-long" />
            <span className="screen-line" />
            <span className="screen-button" />
          </div>
        </div>
        <div className="laptop-base" />
      </div>
      <div className="floating-note">
        <span><Icon name="globe" /></span>
        <span>
          <strong>Learn anywhere</strong>
          <small>Stay connected</small>
        </span>
      </div>
    </div>
  );
}
