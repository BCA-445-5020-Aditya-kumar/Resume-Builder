import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('authUser') || 'null');
  const [resume, setResume] = useState({
    name: storedUser?.username || '',
    email: storedUser?.email || '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    targetRole: '',
    title: 'Product Designer',
    summary: '',
    experience: '',
    projects: '',
    education: '',
    certifications: '',
    achievements: '',
    skills: '',
    keywords: '',
    languages: '',
  });
  const [isSaved, setIsSaved] = useState(false);

  const escapeHtml = (value) =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

  const handleChange = (e) => {
    if (isSaved) {
      setIsSaved(false);
    }

    setResume({ ...resume, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaved(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    navigate('/signin');
  };

  const splitList = (value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const skillList = useMemo(() => splitList(resume.skills), [resume.skills]);
  const keywordList = useMemo(() => splitList(resume.keywords), [resume.keywords]);
  const languageList = useMemo(() => splitList(resume.languages), [resume.languages]);

  const ats = useMemo(() => {
    const hasContact = Number(Boolean(resume.name && resume.email && resume.phone));
    const hasLinks = Number(Boolean(resume.linkedin || resume.github || resume.website));
    const hasTarget = Number(Boolean(resume.targetRole && resume.title));
    const hasSummary = Number((resume.summary || '').trim().length >= 60);
    const hasExperience = Number((resume.experience || '').trim().length >= 120);
    const hasProjects = Number((resume.projects || '').trim().length >= 80);
    const hasEducation = Number((resume.education || '').trim().length >= 30);
    const hasSkills = Number(skillList.length >= 5);
    const hasKeywords = Number(keywordList.length >= 6);
    const hasMetrics = Number(/\d|%|x|years|yrs|crore|lakh|million|kpi|users/i.test(`${resume.summary} ${resume.experience} ${resume.projects} ${resume.achievements}`));
    const hasAchievements = Number((resume.achievements || '').trim().length >= 40);

    const score =
      hasContact * 10 +
      hasLinks * 5 +
      hasTarget * 10 +
      hasSummary * 10 +
      hasExperience * 20 +
      hasProjects * 10 +
      hasEducation * 10 +
      hasSkills * 10 +
      hasKeywords * 10 +
      hasMetrics * 10 +
      hasAchievements * 5;

    return {
      score,
      items: [
        { label: 'Contact details', value: hasContact ? 10 : 0, hint: 'Name, email, and phone should all be present.' },
        { label: 'Professional links', value: hasLinks ? 5 : 0, hint: 'Add LinkedIn, portfolio, or GitHub.' },
        { label: 'Role alignment', value: hasTarget ? 10 : 0, hint: 'Mention target role and current headline.' },
        { label: 'Summary strength', value: hasSummary ? 10 : 0, hint: 'Write a summary with focus and outcomes.' },
        { label: 'Experience depth', value: hasExperience ? 20 : 0, hint: 'Describe impact, ownership, and results.' },
        { label: 'Projects depth', value: hasProjects ? 10 : 0, hint: 'Show 1-2 strong projects with outcomes.' },
        { label: 'Education', value: hasEducation ? 10 : 0, hint: 'Include degree, institute, and year.' },
        { label: 'Skills coverage', value: hasSkills ? 10 : 0, hint: 'Add at least 5 relevant skills.' },
        { label: 'ATS keywords', value: hasKeywords ? 10 : 0, hint: 'Use role-specific keywords from job descriptions.' },
        { label: 'Measured impact', value: hasMetrics ? 10 : 0, hint: 'Add numbers, percentages, scale, or business impact.' },
        { label: 'Achievements', value: hasAchievements ? 5 : 0, hint: 'Awards, ranks, certifications, or wins help.' },
      ],
    };
  }, [keywordList.length, resume, skillList.length]);

  const contactItems = [
    resume.phone || '+00 00000 00000',
    resume.email || 'name@example.com',
    resume.location || 'Your location',
    resume.linkedin || resume.website || 'linkedin.com/in/yourname',
    resume.github || '',
  ].filter(Boolean);

  const previewSkills = skillList.length ? skillList : ['Communication', 'Execution', 'Problem Solving'];
  const previewKeywords = keywordList.length ? keywordList : ['ATS', 'Leadership', 'Strategy'];
  const previewLanguages = languageList.length ? languageList : ['English'];

  const handleDownload = () => {
    const previewWindow = window.open('', '_blank', 'width=900,height=1200');

    if (!previewWindow) {
      window.alert('Popup blocked. Please allow popups to download the resume.');
      return;
    }

    const tagsToHtml = (items) => items.map((item) => `<span>${escapeHtml(item)}</span>`).join('');
    const contactsHtml = contactItems
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join('<span class="dot">|</span>');

    previewWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${escapeHtml(resume.name || 'Resume')}</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 24px; background: #eef2f4; font-family: Arial, Helvetica, sans-serif; color: #16242d; }
            .sheet { max-width: 860px; margin: 0 auto; padding: 34px 42px; background: #fff; box-shadow: 0 18px 45px rgba(0,0,0,.1); }
            .header { padding-bottom: 18px; border-bottom: 2px solid #16242d; }
            h1 { margin: 0; font-size: 30px; letter-spacing: .04em; text-transform: uppercase; }
            .title { margin-top: 6px; color: #31424d; font-size: 15px; font-weight: 700; }
            .target { margin-top: 6px; color: #6a7b84; font-size: 13px; }
            .contact { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; color: #51616b; font-size: 13px; }
            .dot { color: #8a969d; }
            .section { margin-top: 18px; }
            .section-label { margin-bottom: 8px; color: #16242d; font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
            .section p { margin: 0; color: #263741; line-height: 1.65; white-space: pre-wrap; font-size: 14px; }
            .chips { display: flex; flex-wrap: wrap; gap: 8px; }
            .chips span { padding: 5px 10px; border: 1px solid #cfd8dd; border-radius: 999px; color: #263741; font-size: 12px; font-weight: 700; }
            .ats { margin-top: 18px; padding: 12px 14px; border: 1px solid #d7e0e5; background: #f8fafb; }
            .ats strong { font-size: 18px; }
            @media print {
              body { padding: 0; background: white; }
              .sheet { box-shadow: none; max-width: none; min-height: 100vh; }
            }
          </style>
        </head>
        <body>
          <article class="sheet">
            <header class="header">
              <h1>${escapeHtml(resume.name || 'Your name')}</h1>
              <div class="title">${escapeHtml(resume.title || 'Professional title')}</div>
              <div class="target">${escapeHtml(resume.targetRole || 'Target role')}</div>
              <div class="contact">${contactsHtml}</div>
            </header>
            <section class="ats">
              <strong>ATS Score: ${ats.score}/100</strong>
            </section>
            <section class="section"><div class="section-label">Professional Summary</div><p>${escapeHtml(resume.summary || 'Add a strong summary.')}</p></section>
            <section class="section"><div class="section-label">Work Experience</div><p>${escapeHtml(resume.experience || 'Add your work experience.')}</p></section>
            <section class="section"><div class="section-label">Projects</div><p>${escapeHtml(resume.projects || 'Add your best projects.')}</p></section>
            <section class="section"><div class="section-label">Education</div><p>${escapeHtml(resume.education || 'Add your education details.')}</p></section>
            <section class="section"><div class="section-label">Certifications</div><p>${escapeHtml(resume.certifications || 'Add certifications if any.')}</p></section>
            <section class="section"><div class="section-label">Achievements</div><p>${escapeHtml(resume.achievements || 'Add achievements or awards.')}</p></section>
            <section class="section"><div class="section-label">Skills</div><div class="chips">${tagsToHtml(previewSkills)}</div></section>
            <section class="section"><div class="section-label">ATS Keywords</div><div class="chips">${tagsToHtml(previewKeywords)}</div></section>
            <section class="section"><div class="section-label">Languages</div><div class="chips">${tagsToHtml(previewLanguages)}</div></section>
          </article>
          <script>window.onload = function () { window.print(); };</script>
        </body>
      </html>
    `);
    previewWindow.document.close();
  };

  const questionGroups = [
    {
      title: 'Identity',
      fields: [
        { name: 'name', label: 'Full name', placeholder: 'What is your full name?' },
        { name: 'title', label: 'Professional headline', placeholder: 'What should appear under your name?' },
        { name: 'targetRole', label: 'Target role', placeholder: 'Which role are you applying for?' },
        { name: 'location', label: 'Location', placeholder: 'Where are you based?' },
      ],
    },
    {
      title: 'Contact',
      fields: [
        { name: 'email', label: 'Email', placeholder: 'Which email should recruiters contact?' },
        { name: 'phone', label: 'Phone', placeholder: 'Which phone number should appear?' },
        { name: 'linkedin', label: 'LinkedIn', placeholder: 'What is your LinkedIn URL?' },
        { name: 'github', label: 'GitHub', placeholder: 'What is your GitHub URL?' },
        { name: 'website', label: 'Portfolio / Website', placeholder: 'Do you have a portfolio or website?' },
      ],
    },
  ];

  return (
    <main className="builder-page">
      <section className="builder-shell">
        <header className="builder-topbar">
          <div>
            <span className="builder-badge">Resume Reverse Builder</span>
            <h1>Fill every important detail and shape a resume like a polished PDF.</h1>
            <p>
              I could not reliably read the exact PDF structure locally, so this version asks for
              all major resume details, mirrors a clean professional one-page layout, and adds a
              live ATS score.
            </p>
          </div>
          <div className="builder-topbar__actions">
            <div className="builder-user">
              <span className="builder-user__label">Signed in as</span>
              <strong>{storedUser?.username || 'Creator'}</strong>
            </div>
            <button type="button" className="builder-ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className="builder-hero-grid">
          <article className="builder-hero-card">
            <span className="builder-section-label">Resume questionnaire</span>
            <h2>Answer the same kinds of details a strong professional resume usually contains.</h2>
            <p>
              Add crisp facts, measurable outcomes, role-specific keywords, and strong links so
              both recruiters and ATS systems can understand your profile quickly.
            </p>
            <div className="builder-hero-metrics">
              <div>
                <strong>{ats.score}</strong>
                <span>ATS score</span>
              </div>
              <div>
                <strong>{skillList.length || 0}</strong>
                <span>Skills added</span>
              </div>
              <div>
                <strong>{isSaved ? 'Saved' : 'Editing'}</strong>
                <span>Draft status</span>
              </div>
            </div>
          </article>

          <aside className="builder-highlight-card">
            <span className="builder-section-label">ATS tip</span>
            <p>
              Match your `Target role`, `Summary`, `Skills`, and `ATS Keywords` with the exact
              wording used in the job description.
            </p>
          </aside>
        </section>

        <section className="builder-main-grid">
          <form onSubmit={handleSubmit} className="builder-form-card">
            <div className="builder-card-header">
              <div>
                <span className="builder-section-label">Questionnaire</span>
                <h3>Tell me every important resume detail</h3>
              </div>
              {isSaved ? (
                <span className="builder-save-pill builder-save-pill--success">Saved locally</span>
              ) : (
                <span className="builder-save-pill">Unsaved changes</span>
              )}
            </div>

            {questionGroups.map((group) => (
              <section key={group.title} className="builder-question-group">
                <h4>{group.title}</h4>
                <div className="builder-form-grid">
                  {group.fields.map((field) => (
                    <label key={field.name} className="builder-field">
                      <span>{field.label}</span>
                      <input
                        name={field.name}
                        placeholder={field.placeholder}
                        value={resume[field.name]}
                        onChange={handleChange}
                        type={field.name === 'email' ? 'email' : 'text'}
                      />
                    </label>
                  ))}
                </div>
              </section>
            ))}

            <section className="builder-question-group">
              <h4>Professional story</h4>
              <div className="builder-form-grid">
                <label className="builder-field builder-field--full">
                  <span>Professional summary</span>
                  <small>Who are you, what do you specialize in, and what impact do you create?</small>
                  <textarea
                    name="summary"
                    rows="4"
                    placeholder="Example: Product designer with 3+ years of experience improving conversion, retention, and user satisfaction across B2B SaaS products..."
                    value={resume.summary}
                    onChange={handleChange}
                  />
                </label>

                <label className="builder-field builder-field--full">
                  <span>Work experience</span>
                  <small>List role, company, duration, responsibilities, and quantified outcomes.</small>
                  <textarea
                    name="experience"
                    rows="7"
                    placeholder="Example:
Senior Designer | ABC Tech | Jan 2023 - Present
- Led redesign of onboarding and improved activation by 21%
- Worked with PMs and engineers across 3 squads..."
                    value={resume.experience}
                    onChange={handleChange}
                  />
                </label>

                <label className="builder-field builder-field--full">
                  <span>Projects</span>
                  <small>Which personal, academic, or freelance projects deserve a place on the resume?</small>
                  <textarea
                    name="projects"
                    rows="5"
                    placeholder="Project name, tools used, role, and final result."
                    value={resume.projects}
                    onChange={handleChange}
                  />
                </label>

                <label className="builder-field builder-field--full">
                  <span>Education</span>
                  <small>Include degree, college, university, year, and important academic highlights.</small>
                  <textarea
                    name="education"
                    rows="4"
                    placeholder="B.Tech in Computer Science | XYZ University | 2021 | CGPA 8.4"
                    value={resume.education}
                    onChange={handleChange}
                  />
                </label>

                <label className="builder-field builder-field--full">
                  <span>Certifications</span>
                  <small>Which certificates support your target role?</small>
                  <textarea
                    name="certifications"
                    rows="3"
                    placeholder="Google UX Design Certificate, AWS Cloud Practitioner..."
                    value={resume.certifications}
                    onChange={handleChange}
                  />
                </label>

                <label className="builder-field builder-field--full">
                  <span>Achievements</span>
                  <small>What wins, awards, rankings, scholarships, or leadership highlights should be shown?</small>
                  <textarea
                    name="achievements"
                    rows="3"
                    placeholder="Hackathon finalist, top 5% in cohort, scholarship winner..."
                    value={resume.achievements}
                    onChange={handleChange}
                  />
                </label>

                <label className="builder-field builder-field--full">
                  <span>Skills</span>
                  <small>Comma-separated tools, technologies, and core strengths.</small>
                  <input
                    name="skills"
                    placeholder="React, Node.js, Figma, User Research, SQL, Leadership"
                    value={resume.skills}
                    onChange={handleChange}
                  />
                </label>

                <label className="builder-field builder-field--full">
                  <span>ATS keywords</span>
                  <small>Paste job-description keywords you want the ATS to detect.</small>
                  <input
                    name="keywords"
                    placeholder="Stakeholder management, SaaS, wireframing, A/B testing, REST APIs"
                    value={resume.keywords}
                    onChange={handleChange}
                  />
                </label>

                <label className="builder-field builder-field--full">
                  <span>Languages</span>
                  <small>Which spoken or written languages do you know?</small>
                  <input
                    name="languages"
                    placeholder="English, Hindi"
                    value={resume.languages}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </section>

            <div className="builder-actions">
              <button type="submit">Save resume draft</button>
              <button
                type="button"
                className="builder-ghost-button builder-download-button"
                onClick={handleDownload}
              >
                Download resume
              </button>
            </div>
          </form>

          <div className="builder-side-stack">
            <section className="builder-preview-card">
              <div className="builder-card-header">
                <div>
                  <span className="builder-section-label">ATS panel</span>
                  <h3>Score breakdown</h3>
                </div>
                <span className={`builder-ats-score ${ats.score >= 80 ? 'builder-ats-score--good' : ''}`}>
                  {ats.score}/100
                </span>
              </div>
              <div className="builder-ats-list">
                {ats.items.map((item) => (
                  <div key={item.label} className="builder-ats-item">
                    <div>
                      <strong>{item.label}</strong>
                      <p>{item.hint}</p>
                    </div>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="builder-preview-card">
              <div className="builder-card-header">
                <div>
                  <span className="builder-section-label">Live preview</span>
                  <h3>Professional resume sheet</h3>
                </div>
              </div>

              <article className="resume-preview">
                <header className="resume-preview__header">
                  <div>
                    <h2>{resume.name || 'Your name'}</h2>
                    <p>{resume.title || 'Professional title'}</p>
                    <div className="resume-preview__target">{resume.targetRole || 'Target role'}</div>
                  </div>
                </header>

                <div className="resume-preview__contact-row">
                  {contactItems.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <section className="resume-preview__section">
                  <span>Professional Summary</span>
                  <p>{resume.summary || 'Add a focused summary with your strengths, domain, and outcomes.'}</p>
                </section>

                <section className="resume-preview__section">
                  <span>Work Experience</span>
                  <p>{resume.experience || 'Add role, company, duration, ownership, and measurable results.'}</p>
                </section>

                <section className="resume-preview__section">
                  <span>Projects</span>
                  <p>{resume.projects || 'Add important projects with stack, scope, and final impact.'}</p>
                </section>

                <section className="resume-preview__section">
                  <span>Education</span>
                  <p>{resume.education || 'Add degree, institute, year, and strong academic details.'}</p>
                </section>

                <section className="resume-preview__section">
                  <span>Certifications</span>
                  <p>{resume.certifications || 'Add certifications relevant to your target role.'}</p>
                </section>

                <section className="resume-preview__section">
                  <span>Achievements</span>
                  <p>{resume.achievements || 'Add awards, rankings, scholarships, or notable wins.'}</p>
                </section>

                <section className="resume-preview__section">
                  <span>Skills</span>
                  <div className="resume-preview__skills">
                    {previewSkills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </section>

                <section className="resume-preview__section">
                  <span>ATS Keywords</span>
                  <div className="resume-preview__skills">
                    {previewKeywords.map((keyword) => (
                      <span key={keyword}>{keyword}</span>
                    ))}
                  </div>
                </section>

                <section className="resume-preview__section">
                  <span>Languages</span>
                  <div className="resume-preview__skills">
                    {previewLanguages.map((language) => (
                      <span key={language}>{language}</span>
                    ))}
                  </div>
                </section>
              </article>
            </section>
          </div>
        </section>
      </section>
    </main>
  );
};

export default ResumeBuilder;
