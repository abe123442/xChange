"use client";

import { ProfileProps } from "@/lib/utils";
import './profile.css';

export const Profile: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <main className="main">
      <div className="grid-container">
        <div className="p-name">
          <b className="name">
            {profile.name}
          </b>
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
          <div className="category">
            {profile.category}
          </div>
        </div>

        <div className="p-minwam">
          <b>
            Minimum Wam
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
            <a href={profile.link} target="_blank" className="link">
              <span>
                Course Catalogue
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}