import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'
import Navbar from "../../auth/components/Navbar"

const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: '💻'
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: '🗣️'
    },
    {
        id: 'roadmap',
        label: 'Road Map',
        icon: '🛣️'
    },
]

const QuestionCard = ({ item, index }) => {

    const [open, setOpen] = useState(false)

    return (

        <div className='q-card'>

            <div
                className='q-card__header'
                onClick={() => setOpen(!open)}
            >

                <span className='q-card__index'>
                    Q{index + 1}
                </span>

                <p className='q-card__question'>
                    {item?.question}
                </p>

                <span className='q-card__chevron'>
                    {open ? '▲' : '▼'}
                </span>

            </div>

            {open && (

                <div className='q-card__body'>

                    <div className='q-card__section'>

                        <span className='q-card__tag q-card__tag--intention'>
                            Intention
                        </span>

                        <p>{item?.intention}</p>

                    </div>

                    <div className='q-card__section'>

                        <span className='q-card__tag q-card__tag--answer'>
                            Model Answer
                        </span>

                        <p>{item?.answer}</p>

                    </div>

                </div>

            )}

        </div>

    )

}

const RoadMapDay = ({ day }) => (

    <div className='roadmap-day'>

        <div className='roadmap-day__header'>

            <span className='roadmap-day__badge'>
                Day {day?.day}
            </span>

            <h3 className='roadmap-day__focus'>
                {day?.focus}
            </h3>

        </div>

        <ul className='roadmap-day__tasks'>

            {day?.tasks?.map((task, i) => (

                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>

            ))}

        </ul>

    </div>

)

const Interview = () => {

    const [activeNav, setActiveNav] = useState('technical')

    const {
        report,
        getReportById,
        getResumePdf,
        loading
    } = useInterview()

    const { interviewId } = useParams()

    useEffect(() => {

        if (interviewId) {

            getReportById(interviewId)

        }

    }, [interviewId])

    if (loading || !report) {

        return (

            <>
                <Navbar />

                <main className='loading-screen'>
                    <h1>Loading your interview plan...</h1>
                </main>
            </>

        )

    }

    const technicalQuestions =
        report?.technicalQuestions || []

    const behavioralQuestions =
        report?.behavioralQuestions ||
        report?.behaviouralQuestions ||
        []

    const preparationPlan =
        report?.preparationPlan || []

    const skillGaps =
        report?.skillGaps ||
        report?.skillsGaps ||
        []

    const scoreColor =
        report?.matchScore >= 80
            ? 'score--high'
            : report?.matchScore >= 60
                ? 'score--mid'
                : 'score--low'

    return (

        <>
            <Navbar />

            <div className='interview-page'>

                <div className='interview-layout'>

                    {/* LEFT NAV */}

                    <nav className='interview-nav'>

                        <div className="nav-content">

                            <p className='interview-nav__label'>
                                Sections
                            </p>

                            {NAV_ITEMS.map(item => (

                                <button
                                    key={item.id}
                                    className={`interview-nav__item ${activeNav === item.id
                                            ? 'interview-nav__item--active'
                                            : ''
                                        }`}
                                    onClick={() => setActiveNav(item.id)}
                                >

                                    <span className='interview-nav__icon'>
                                        {item.icon}
                                    </span>

                                    {item.label}

                                </button>

                            ))}

                        </div>

                    </nav>

                    <div className='interview-divider' />

                    {/* CENTER CONTENT */}

                    <main className='interview-content'>

                        {/* TECHNICAL */}

                        {activeNav === 'technical' && (

                            <section>

                                <div className='content-header'>

                                    <h2>Technical Questions</h2>

                                    <span className='content-header__count'>
                                        {technicalQuestions.length} questions
                                    </span>

                                </div>

                                <div className='q-list'>

                                    {technicalQuestions.length > 0 ? (

                                        technicalQuestions.map((q, i) => (

                                            <QuestionCard
                                                key={i}
                                                item={q}
                                                index={i}
                                            />

                                        ))

                                    ) : (

                                        <p>No technical questions found.</p>

                                    )}

                                </div>

                            </section>

                        )}

                        {/* BEHAVIORAL */}

                        {activeNav === 'behavioral' && (

                            <section>

                                <div className='content-header'>

                                    <h2>Behavioral Questions</h2>

                                    <span className='content-header__count'>
                                        {behavioralQuestions.length} questions
                                    </span>

                                </div>

                                <div className='q-list'>

                                    {behavioralQuestions.length > 0 ? (

                                        behavioralQuestions.map((q, i) => (

                                            <QuestionCard
                                                key={i}
                                                item={q}
                                                index={i}
                                            />

                                        ))

                                    ) : (

                                        <p>No behavioral questions generated.</p>

                                    )}

                                </div>

                            </section>

                        )}

                        {/* ROADMAP */}

                        {activeNav === 'roadmap' && (

                            <section>

                                <div className='content-header'>

                                    <h2>Preparation Road Map</h2>

                                    <span className='content-header__count'>
                                        {preparationPlan.length} Day Plan
                                    </span>

                                </div>

                                <div className='roadmap-list'>

                                    {preparationPlan.map((day, i) => (

                                        <RoadMapDay
                                            key={i}
                                            day={day}
                                        />

                                    ))}

                                </div>

                            </section>

                        )}

                    </main>

                    <div className='interview-divider' />

                    {/* RIGHT SIDEBAR */}

                    <aside className='interview-sidebar'>

                        <div className='match-score'>

                            <p className='match-score__label'>
                                Match Score
                            </p>

                            <div className={`match-score__ring ${scoreColor}`}>

                                <span className='match-score__value'>
                                    {report?.matchScore || 0}
                                </span>

                                <span className='match-score__pct'>
                                    %
                                </span>

                            </div>

                            <p className='match-score__sub'>
                                Strong match for this role
                            </p>

                        </div>

                        <div className='sidebar-divider' />

                        {/* SKILL GAPS */}

                        <div className='skill-gaps'>

                            <p className='skill-gaps__label'>
                                Skill Gaps
                            </p>

                            <div className='skill-gaps__list'>

                                {skillGaps.length > 0 ? (

                                    skillGaps.map((gap, i) => (

                                        <span
                                            key={i}
                                            className={`skill-tag skill-tag--${gap?.severity || 'low'}`}
                                        >

                                            {gap?.skill}

                                        </span>

                                    ))

                                ) : (

                                    <p>No skill gaps found.</p>

                                )}

                            </div>

                            {/* DOWNLOAD BUTTON */}

                            <button
                                className='download-btn'
                                onClick={() => getResumePdf(interviewId)}
                            >
                                Download Report PDF
                            </button>

                        </div>

                    </aside>

                </div>

            </div>
        </>

    )

}

export default Interview