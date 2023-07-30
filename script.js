const CAT_FRAME_TIME = 350;
const TITLE_FRAME_TIME = 200;
const TITLE = "happy birthday from your bro";
const RAINBOW_COLORS = [
  "#ff0000",
  "#ffa500",
  "#ffff00",
  "#008000",
  "#0000ff",
  "#4b0082",
  "#ee82ee",
];

const GRAVITY = 1000;

const makeConfetti = (root, x, y, size, toRight = true) => {
  let velocity = [
    (250 + Math.random() * 200) * (toRight ? 1 : -1),
    300 + Math.random() * 250,
  ];
  const newSize = size - 20 + Math.random() * 40;
  let position = [
    x - size / 2 - 20 + Math.random() * 40,
    y + size / 2 - 20 + Math.random() * 40,
  ];
  let el = $("<img />")
    .attr("src", "dancin-confetti-cat/confetti-expand.png")
    .addClass("confetti");
  let rotation = Math.random() * 360;
  const rotationRate = -360 + Math.random() * 720;

  const getStyleString = () =>
    `top: ${window.innerHeight - position[1]}px; left: ${
      position[0]
    }px; transform: rotate(${rotation}deg); width: ${newSize}px; height: ${newSize}px`;

  el.attr("style", getStyleString());

  const update = (deltaT) => {
    const [x, y] = position;
    const [vx, vy] = velocity;
    position = [x + vx * deltaT, y + vy * deltaT];
    velocity = [vx, vy - GRAVITY * deltaT];

    rotation = (rotation + rotationRate * deltaT) % 360;

    el.attr("style", getStyleString());
  };

  const add = () => {
    root.append(el);
  };

  const remove = () => {
    el.remove();
  };

  const isInRect = () => {
    const [x, y] = position;
    return x <= window.innerWidth + newSize && x > -newSize && y > -newSize;
  };

  return { update, add, remove, isInRect };
};

const run = () => {
  const indices = ["000", "001", "002", "003"];
  cats = indices.map((i) => `dancin-confetti-cat/cat-${i}.png`);
  catsExpand = indices.map((i) => `dancin-confetti-cat/cat-expand-${i}.png`);
  let titleIndex = 0;
  let titleColorIndex = 0;
  let lastCatUpdate = Date.now();
  let lastTitleUpdate = Date.now();
  let lastT = Date.now();
  const img = $("<img />").attr("src", catsExpand[0]).addClass("catto-img");
  const icon = $('link[rel="icon"]').attr("href", cats[0]);

  const title2 = $("<div></div>").text(TITLE).addClass("bday-text");
  $("#root").append(img).append(title2);

  let confettis = [];

  function render() {
    const now = Date.now();
    const deltaT = (now - lastT) / 1000;

    confettis.forEach((c) => {
      c.update(deltaT);
      if (!c.isInRect()) {
        c.remove();
      }
    });

    confettis = confettis.filter((c) => c.isInRect());

    if (now - lastCatUpdate > CAT_FRAME_TIME) {
      const newIndex =
        (catsExpand.findIndex((e) => e === img.attr("src")) + 1) %
        catsExpand.length;
      img.attr("src", catsExpand[newIndex]);
      icon.attr("href", cats[newIndex]);

      if (newIndex === 1 || newIndex === 3) {
        const imgPos = img.position();
        const imgWidth = img.width();
        const imgHeight = img.height();
        const isRight = newIndex === 3;
        const y = imgPos.top + imgHeight / 2;
        const x =
          imgPos.left + imgWidth / 2 + (isRight ? imgWidth / 3 : -imgWidth / 3);
        Array(5)
          .fill(1)
          .forEach(() => {
            const c = makeConfetti($("#root"), x, y, 150, isRight);
            c.add();
            confettis.push(c);
          });
      }

      lastCatUpdate = now;
    }

    if (now - lastTitleUpdate > TITLE_FRAME_TIME) {
      do {
        titleIndex = (titleIndex + 1) % TITLE.length;
      } while (TITLE[titleIndex] === " ");

      titleColorIndex = (titleColorIndex + 1) % RAINBOW_COLORS.length;

      const newTitle = [...TITLE]
        .map((c, i) => (i === titleIndex ? c.toUpperCase() : c))
        .join("");

      $("title").text(newTitle);
      title2
        .text(newTitle)
        .attr("style", `color: ${RAINBOW_COLORS[titleColorIndex]};`);
      lastTitleUpdate = now;
    }

    lastT = now;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
};

$(() => {
  $("#clickme").on("click", () => {
    $("audio").get(0)?.play();
    $("#clickme").remove();
    run();
  })
});
