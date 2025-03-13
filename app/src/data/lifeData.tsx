const backgroundImage = "/images/life/hobbies/background.jpg";

export const lifePageData = {
  title: "My Life",
  description:
    "I'm not going to lie I do love to work. Unless it's writing documentation then you'd rather see me at the DMV. However I do think that taking some time aside to prioritize getting outdoors and hanging out with family and friends is what this is all about.",
  backgroundImage: backgroundImage,

  hobbies: [
    {
      name: "Skiing & Snowboarding",
      description:
        "One of the main reasons why I moved out of Kansas was to be able to hit the snow on an actual hill.",
      image: "/images/life/hobbies/skiing.jpg",
      icon: "ski",
    },
    {
      name: "Running",
      description:
        "I moved to Colorado for the winters, and I've ended up staying for the summers. I love running here, so many trails with great weather. I've made a lot of friends within the running community here, and for that I'm grateful. ",
      image: "/images/life/hobbies/running.jpg",
      icon: "run",
    },
    {
      name: "Backpacking",
      description:
        "Family thinks I'm crazy for it, they just don't understand the joy of eating gushers on day 3 mile 40.",
      image: "/images/life/hobbies/backpacking.jpg",
      icon: "backpack",
    },
    {
      name: "Hangin with Friends and Family",
      description: "It's what this is all about.",
      image: "/images/life/hobbies/family.jpg",
      icon: "family",
    },
  ],

  quote: {
    text: "One hand washes the other.",
    author: "Hunter S Thompson",
  },

  categories: [
    { id: "outdoors", name: "Outdoors" },
    { id: "travel", name: "Travel" },
    { id: "adventures", name: "Adventures" },
    { id: "pets", name: "Pets" },
    { id: "family", name: "Family" },
  ],

  galleryItems: [
    {
      id: 1,
      image: "/images/life/gallery/1.jpg",
      caption: "The champion Yogi and I",
      categories: ["outdoors", "adventures", "pets"],
      span: true,
    },
    {
      id: 2,
      image: "/images/life/gallery/2.jpg",
      caption: "Enjoying Conundrum Hot Springs with my lady",
      categories: ["outdoors", "adventures", "family"],
    },
    {
      id: 3,
      image: "/images/life/gallery/3.jpg",
      caption:
        "Me with my old co-workers from Cerner finishing the 4 Loop Pass",
      categories: ["outdoors", "adventures"],
    },
    {
      id: 4,
      image: "/images/life/gallery/4.jpg",
      caption: "Trail Running with my dawg Lewis",
      categories: ["adventures", "outdoors"],
    },
    {
      id: 5,
      image: "/images/life/gallery/5.jpg",
      caption: "Casually sky diving",
      categories: ["adventures"],
    },
    {
      id: 6,
      image: "/images/life/gallery/6.jpg",
      caption: "Skiin the Steamboat with the rents",
      categories: ["travel", "adventures", "outdoors", "family"],
      span: true,
    },
  ],
};
