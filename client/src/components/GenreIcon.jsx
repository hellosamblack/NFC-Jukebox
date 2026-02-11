import { GENRES } from '../utils/genres';

export default function GenreIcon({ genre = 'Default', size = 32 }) {
  const config = GENRES[genre] || GENRES.Default;

  return (
    <span
      className="inline-flex items-center justify-center rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: config.color,
        fontSize: size * 0.5,
        lineHeight: 1,
      }}
      title={genre}
    >
      {config.icon}
    </span>
  );
}
