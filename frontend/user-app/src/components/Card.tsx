import { Link } from "react-router-dom";

interface CardProps {
  className?: string;
  imgSrc: string;
  toPath: string;
  title: string;
  content: string;
}

const Card: React.FC<CardProps> = ({
  className,
  imgSrc,
  toPath,
  title,
  content,
}) => {
  return (
    <article className={className}>
      <span className="image">
        <img src={imgSrc} alt="" />
      </span>

      <Link to={toPath}>
        <h2>{title}</h2>
        <div className="content">
          <p>{content}</p>
        </div>
      </Link>
    </article>
  );
};

export default Card;
