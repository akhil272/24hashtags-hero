import { gsap } from "gsap";
import { lerp, getMousePos, getSiblings } from "./utils";

//Grab the mouse position and set it to mouse state

let mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (ev) => (mouse = getMousePos(ev)));

export default class Cursor {
  constructor(el) {
    //variables
    this.Cursor = el;
    this.Cursor.style.opacity = 0;
    this.Item = document.querySelectorAll(".hero-inner-link-item");
    this.Hero = document.querySelector(".hero-inner");
    this.bounds = this.Cursor.getBoundingClientRect();
    this.cursorConfigs = {
      x: { previous: 0, current: 0, amt: 0.2 },
      y: { previous: 0, current: 0, amt: 0.2 },
    };
    //define mouse move function
    this.onMouseMoveEv = () => {
      this.cursorConfigs.x.previous = this.cursorConfigs.x.current = mouse.x;
      this.cursorConfigs.y.previous = this.cursorConfigs.y.current = mouse.y;
      //set cursor opacity to 1 when hoverd on screen
      gsap.to(this.Cursor, {
        duration: 1,
        ease: "Power3.easeOut",
        opacity: 1,
      });
      // excute scale
      this.onScaleMouse();

      //request set animation
      requestAnimationFrame(() => this.render());

      window.removeEventListener("mousemove", this.onMouseMoveEv);
    };

    window.addEventListener("mousemove", this.onMouseMoveEv);
  }
  //scale functions

  onScaleMouse() {
    this.Item.forEach((link) => {
      if (link.matches(":hover")) {
        this.setVideo(link);
        this.scaleAnimation(this.Cursor.children[0], 0.8);
      }

      link.addEventListener("mouseenter", () => {
        //scale animation for media
        this.setVideo(link);
        this.scaleAnimation(this.Cursor.children[0], 0.8);
      });
      //scale down media on hover off
      link.addEventListener("mouseleave", () => {
        this.scaleAnimation(this.Cursor.children[0], 0);
      });
      //hover on tag to expand
      link.children[1].addEventListener("mouseenter", () => {
        this.Cursor.classList.add("media-blend");
        this.scaleAnimation(this.Cursor.children[0], 1.2);
      });
      // oof hover scale to .8
      link.children[1].addEventListener("mouseleave", () => {
        this.Cursor.classList.remove("media-blend");
        this.scaleAnimation(this.Cursor.children[0], 0.8);
      });
    });
  }
  //scale animation
  scaleAnimation(el, amt) {
    gsap.to(el, {
      duration: 0.6,
      scale: amt,
      ease: "Power3.easeOut",
    });
  }

  setVideo(el) {
    //grab video
    let src = el.getAttribute("data-video-src");
    let video = document.querySelector(`#${src}`);
    let siblings = getSiblings(video);
    // console.log(src, "Hover on this item");
    // console.log(siblings, "grabbed siblings");

    if (video.id == src) {
      gsap.set(video, { zIndex: 4, opacity: 1 });
      siblings.forEach((i) => {
        gsap.set(i, { zIndex: 1, opacity: 0 });
      });
    }
  }

  render() {
    this.cursorConfigs.x.current = mouse.x;
    this.cursorConfigs.y.current = mouse.y;

    //lerp
    for (const key in this.cursorConfigs) {
      this.cursorConfigs[key].previous = lerp(
        this.cursorConfigs[key].previous,
        this.cursorConfigs[key].current,
        this.cursorConfigs[key].amt
      );
    }
    this.Cursor.style.transform = `translateX(${this.cursorConfigs.x.previous}px) translateY(${this.cursorConfigs.y.previous}px)`;

    requestAnimationFrame(() => this.render());
  }
}
