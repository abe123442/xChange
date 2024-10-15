import Card from "../components/Card";

const HomePage: React.FC = () => {
  const NUM_IMAGES = 12;
  const NUM_STYLES = 6;

  return (
    <div id="main">
      <div className="inner">
        <header>
          <h1>
            This is Phantom, a free, fully responsive site
            <br />
            template designed by <a href="http://html5up.net">HTML5 UP</a>.
          </h1>
          <p>
            Etiam quis viverra lorem, in semper lorem. Sed nisl arcu euismod sit
            amet nisi euismod sed cursus arcu elementum ipsum arcu vivamus quis
            venenatis orci lorem ipsum et magna feugiat veroeros aliquam. Lorem
            ipsum dolor sit amet nullam dolore.
          </p>
        </header>

        <section className="tiles">
          {Array.from({ length: NUM_IMAGES }).map((_, i) => {
            const style =
              i < NUM_STYLES ? i + 1 : ~~(Math.random() * NUM_STYLES) + 1;
            const src = `/pic${String(style).padStart(2, "0")}.jpg`;
            return (
              <Card
                key={i}
                className={`style${style}`}
                toPath="/generic"
                title={`title${i}`}
                imgSrc={src}
                content={`content${i}`}
              />
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
