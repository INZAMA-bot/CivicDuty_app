import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES, allDepts } from '../data/countries';
import { Search, ChevronRight } from 'lucide-react';

export const DepartmentsView: React.FC = () => {
  const { user, ensureCitizenSession, posts, go, setActiveDept, setActiveDeptCountry, setUser, toast } = useApp();
  const [search, setSearch] = useState('');

  const activeUser = user || ensureCitizenSession();
  const country = activeUser.country || 'UG';
  const depts = allDepts(country);
  const followed = activeUser.followed || [];

  const filterList = (list: any[]) =>
    list.filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.ministry && d.ministry.toLowerCase().includes(search.toLowerCase())) ||
        (d.full && d.full.toLowerCase().includes(search.toLowerCase()))
    );

  const toggleFollow = (id: string) => {
    let newFollowed = [...followed];
    if (newFollowed.includes(id)) {
      newFollowed = newFollowed.filter((item) => item !== id);
      toast('Unfollowed wall', 'slate');
    } else {
      newFollowed.push(id);
      toast('Following wall', 'emerald');
    }
    setUser({ ...activeUser, followed: newFollowed });
  };

  const renderCard = (d: any) => {
    const isF = followed.includes(d.id);
    const postCount = posts.filter((p) => p.dept === d.id && p.country === country).length;
    const resCount = posts.filter((p) => p.dept === d.id && p.country === country && p.status === 'resolved').length;

    return (
      <div key={d.id} className="card p-3.5 hover:border-slate-700/80">
        <div className="flex items-center justify-between gap-3">
          <div
            onClick={() => {
              setActiveDept(d.id);
              setActiveDeptCountry(country);
              go('dept_wall');
            }}
            className="flex items-center gap-3 flex-1 cursor-pointer"
          >
            <span className="text-lg">{d.icon || '🏢'}</span>
            <div>
              <div className="text-sm font-bold text-slate-100">{d.name}</div>
              <div className="text-[9px] mono text-slate-400">{d.ministry || d.full}</div>
              {postCount > 0 && (
                <div className="text-[8px] mono text-teal-400 mt-0.5">
                  {postCount} posts · {resCount} resolved
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => toggleFollow(d.id)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-[9px] mono font-bold border transition-all ${
              isF
                ? 'border-teal-500/50 text-teal-300 bg-teal-500/10 shadow-[0_0_10px_rgba(20,184,166,0.2)]'
                : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {isF ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div>
        <div className="tagline text-teal-400 mb-1.5">Departments</div>
        <h2 className="text-[22px] font-black text-slate-100 tracking-tight leading-tight">
          {COUNTRIES[country]?.name} Walls
        </h2>
        <p className="text-[11px] mono text-slate-400 mt-1">{depts.length} entities · follow to add to Registry</p>
      </div>

      <div className="sw">
        <Search size={15} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search departments, ministries..."
          className="mono text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] mono text-zinc-500 uppercase tracking-widest">Lane 1 · Civic Gov</span>
          <span className="chip ch-gov">Verified Gov</span>
        </div>
        <div className="space-y-2">
          {filterList(depts.filter((d) => d.lane === 'civic')).map(renderCard)}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] mono text-zinc-500 uppercase tracking-widest">Lane 2 · Private</span>
          <span className="chip ch-private">Verified Private</span>
        </div>
        <div className="space-y-2">
          {filterList(depts.filter((d) => d.lane === 'consumer')).map(renderCard)}
        </div>
      </div>

      <div className="card p-4 space-y-2">
        <p className="text-[9px] mono text-zinc-500 uppercase tracking-widest">Entity Not Listed?</p>
        <p className="text-[12px] text-zinc-400 leading-relaxed">
          File a ticket and select "Others" — tagged [Unverified] and auto-CC'd to the relevant ministry.
        </p>
        <button
          onClick={() => go('compose')}
          className="text-[10px] mono text-emerald-500 hover:text-emerald-400 transition-colors mt-1 font-bold"
        >
          + File to Others
        </button>
      </div>
    </div>
  );
};
