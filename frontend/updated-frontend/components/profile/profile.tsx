"use client";

import { ProfileProps } from "@/lib/utils";
import './profile.css';

export const Profile: React.FC<ProfileProps> = ({ profile }) => {
  const getCategoryColour = () => {
    switch (profile.category) {
      case 'High Demand':
        return 'category category-red';
      case 'High Capacity':
        return 'category category-green';
      case 'Super Partner':
        return 'category category-yellow'
    }
  };
  return (
    <main className="main">
      <div className="grid-container">
        <div className="p-name">
          <div className="name">
            {profile.name}
          </div>
          <hr className="divider"></hr>
        </div>

        <div className="p-desc">
          <b>
            Description
          </b>
          <p>
            {profile.desc ? profile.desc : 'N/A'}
          </p>
        </div>

        <div className="p-scope">
          <b>
            Disciplines
          </b>
          <p>
            {profile.scope}
          </p>
        </div>

        <div className="p-category">
          <div className={getCategoryColour()}>
            <b> {profile.category} </b>
          </div>
        </div>

        <div className="p-minwam">
          <b>
            Minimum WAM
          </b>
          <p>
            {profile.minWam}
          </p>
        </div>

        <div className="p-load">
          <b>
            Full Time Load
          </b>
          <p>
            {profile.load}
          </p>
        </div>

        <div className="p-deglevels">
          <b>
            Degree Levels
          </b>
          <p>
            {profile.degLevels.join(', ')}
          </p>
        </div>

        <div className="p-link">
          <div>
            <a href={profile.link} target="_blank" className="button">
              <span>
                Course Catalogue
              </span>
            </a>
          </div>
        </div>
      </div>

      <script>
      </script>
    </main>
  );
}