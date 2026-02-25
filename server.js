const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv')
dotenv.config()
const token = process.env.TELEGRAM_BOT_TOKEN;
const port = Number(process.env.PORT || 3000);
const useWebhook = process.env.USE_WEBHOOK === 'true' || !!process.env.RENDER;
const webhookPath = process.env.TELEGRAM_WEBHOOK_PATH || '/telegram/webhook';
const telegramSecretToken = process.env.TELEGRAM_SECRET_TOKEN;
const startedAt = Date.now();

if (!token) {
    throw new Error('Missing TELEGRAM_BOT_TOKEN environment variable.');
}

const profile = {
    name: 'Avinash Sharma',
    title: 'Full-Stack Developer (MERN) | Final-year B.Tech IT Student',
    location: 'Meerut, Uttar Pradesh, India',
    phone: '+91 6201693634',
    email: 'avinashsharma31384@gmail.com',
    summary:
        'Final-year B.Tech IT student and Full-Stack Developer specializing in the MERN stack, with internship experience building production-ready web and mobile applications. Strong in backend engineering, REST API design, authentication, and role-based access control.',
    education: {
        degree: 'B.Tech in Information Technology',
        college: 'Swami Vivekanand Subharti University, Meerut',
        duration: '2022 - 2026',
        cgpa: '8.44'
    },
    skills: {
        languages: ['Java', 'JavaScript (ES6+)', 'TypeScript', 'Python'],
        frontend: ['React.js', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3'],
        backend: ['Node.js', 'Express.js', 'MongoDB (Mongoose)', 'REST APIs', 'JWT'],
        realtimeCloud: ['Socket.IO', 'Firebase', 'Cloudinary'],
        csFundamentals: ['DSA', 'OOP', 'DBMS', 'OS']
    },
    experience: [
        {
            company: 'EpiCircle',
            role: 'Full Stack Developer Intern (React Native)',
            period: 'July 2025 - Present',
            highlights: [
                'Enhanced production React Native app with new scrap collection features',
                'Improved UI/UX flows and optimized component structure'
            ]
        },
        {
            company: 'Ideovent Technologies',
            role: 'Software Developer Intern',
            period: 'June 2025 - Sep 2025',
            highlights: [
                'Led interns to deliver two full-stack web applications',
                'Built scalable services with Node.js, Express, MongoDB and responsive React + Tailwind frontend'
            ]
        }
    ],
    projects: [
        {
            name: 'Academic Notes Manager',
            stack: 'MERN, Cloudinary',
            gist: 'Centralized academic repository with role-based access and advanced filtering.'
        },
        {
            name: 'Institute ERP System',
            stack: 'React (TypeScript), Node.js, MongoDB',
            gist: 'Institute platform with RBAC, fee management, attendance, and content uploads.'
        },
        {
            name: 'Course Selling Platform',
            stack: 'MERN, JWT, Rate Limiting',
            gist: 'Scalable e-learning platform with secure auth, role access, and API protection.'
        },
        {
            name: 'Pet Adoption Platform',
            stack: 'React, Firebase',
            gist: 'Serverless adoption portal with auth and real-time listings sync.'
        }
    ],
    certifications: ['DSA with Java - NPTEL (2023)', 'Java Programming - NPTEL (2024)', 'Cloud Computing - NPTEL (2025)'],
    links: {
        portfolio: 'https://www.avinashsharmadev.me/',
        github: 'https://github.com/Avinashsharma01',
        linkedin: 'https://www.linkedin.com/in/avinash-sharma-1a4251244/',
        leetcode: 'https://leetcode.com/u/Avinash_Sharma0000/',
        hackerrank: 'https://www.hackerrank.com/profile/avinashsharma311',
        codechef: 'https://www.codechef.com/users/avinashh0101',
        codeforces: 'https://codeforces.com/profile/AvinashSharma01'
    }
};

const bot = new TelegramBot(token, useWebhook ? {} : { polling: true });
const app = express();

app.get('/', (_req, res) => {
    res.status(200).json({
        ok: true,
        service: 'avinash-telegram-bot',
        mode: useWebhook ? 'webhook' : 'polling'
    });
});

app.use(express.json());

app.post(webhookPath, (req, res) => {
    if (telegramSecretToken) {
        const incomingToken = req.get('x-telegram-bot-api-secret-token');
        if (incomingToken !== telegramSecretToken) {
            res.status(403).json({ ok: false, message: 'Invalid telegram secret token.' });
            return;
        }
    }

    bot.processUpdate(req.body);
    res.sendStatus(200);
});

const helpMessage = [
    'I am Avinash Assistant 🤖',
    '',
    'Ask me things like:',
    '- Who is Avinash?',
    '- What are his skills?',
    '- Show projects',
    '- Internship experience?',
    '- Resume for frontend/backend/fullstack/faang/sde/dev',
    '- Contact details',
    '',
    'Commands:',
    '/about /resume /skills /projects /experience /education /certifications /contact /links /menu /status',
    '',
    'Resume PDF usage:',
    '/resume frontend',
    '/resume backend',
    '/resume fullstack',
    '/resume faang',
    '/resume sde',
    '/resume dev'
].join('\n');

const resumeProfiles = {
    frontend: {
        title: 'Frontend Resume Snapshot',
        objective:
            'Frontend-focused developer building responsive and user-friendly interfaces with React, Next.js, and Tailwind CSS.',
        highlights: [
            'Strong UI implementation in React.js, Next.js, Tailwind CSS, HTML5, CSS3',
            'Improved UI/UX flows during EpiCircle internship',
            'Built responsive dashboards and user interfaces across multiple projects'
        ],
        fitProjects: ['Institute ERP System', 'Pet Adoption Platform', 'Student Marketplace'],
        stack: ['React.js', 'Next.js', 'Tailwind CSS', 'TypeScript', 'React Native']
    },
    backend: {
        title: 'Backend Resume Snapshot',
        objective:
            'Backend-oriented engineer experienced in designing secure and scalable APIs using Node.js, Express.js, and MongoDB.',
        highlights: [
            'Built scalable backend services and REST APIs',
            'Strong in JWT auth, RBAC, and API rate limiting',
            'Hands-on experience with MongoDB, Mongoose, Cloudinary integration'
        ],
        fitProjects: ['Course Selling Platform', 'Academic Notes Manager', 'Institute ERP System'],
        stack: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT']
    },
    fullstack: {
        title: 'Full-Stack Resume Snapshot',
        objective:
            'MERN Full-Stack developer with internship experience delivering complete web/mobile features from UI to database.',
        highlights: [
            'Delivered end-to-end products with React + Node + MongoDB',
            'Led intern team and owned technical decisions at Ideovent',
            'Built production-ready features with authentication and role-based access control'
        ],
        fitProjects: ['Academic Notes Manager', 'Institute ERP System', 'Course Selling Platform'],
        stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS']
    },
    faang: {
        title: 'FAANG-Targeted Resume Snapshot',
        objective:
            'Problem-solving focused candidate with strong CS fundamentals, MERN implementation skills, and active coding profile practice.',
        highlights: [
            'Strong CS base: DSA, OOP, DBMS, OS',
            '500+ solved problems on LeetCode and competitive coding exposure',
            'Built multiple real-world full-stack applications with scalable architecture'
        ],
        fitProjects: ['Academic Notes Manager', 'Course Selling Platform', 'Real-time Chat Application'],
        stack: ['Java', 'JavaScript', 'TypeScript', 'Node.js', 'React.js']
    },
    sde: {
        title: 'SDE Resume Snapshot',
        objective:
            'SDE-ready profile with practical backend and full-stack development experience, strong debugging mindset, and team collaboration.',
        highlights: [
            'Experience in system feature delivery during internships',
            'Implemented secure APIs, RBAC, and performance-conscious service design',
            'Comfortable with end-to-end software lifecycle and problem solving'
        ],
        fitProjects: ['Institute ERP System', 'Academic Notes Manager', 'Course Selling Platform'],
        stack: ['Node.js', 'React.js', 'MongoDB', 'Java', 'Git']
    }
};

const resumeFiles = {
    frontend: 'Avinash_Sharma_Resume_Frontend.pdf',
    backend: 'Avinash_Sharma_Resume_Backend.pdf',
    fullstack: 'Avinash_Sharma_Resume_FullStack.pdf',
    faang: 'Avinash_Sharma_Resume_FAANG.pdf',
    sde: 'Avinash_Sharma_Resume_SDE.pdf',
    dev: 'Avinash_Sharma_Resume_Dev.pdf'
};

const knownCommands = new Set([
    '/start',
    '/help',
    '/menu',
    '/about',
    '/resume',
    '/frontend_resume',
    '/backend_resume',
    '/fullstack_resume',
    '/faang_resume',
    '/sde_resume',
    '/dev_resume',
    '/skills',
    '/projects',
    '/experience',
    '/education',
    '/certifications',
    '/contact',
    '/links',
    '/portfolio',
    '/status'
]);

function normalizeResumeDomain(value = '') {
    const clean = value.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
    if (clean === 'fullstack' || clean === 'mern') return 'fullstack';
    if (clean === 'front' || clean === 'frontend') return 'frontend';
    if (clean === 'back' || clean === 'backend') return 'backend';
    if (clean === 'faang') return 'faang';
    if (clean === 'sde' || clean === 'softwaredeveloper') return 'sde';
    if (clean === 'dev' || clean === 'developer') return 'dev';
    return null;
}

function availableResumeDomainsMessage() {
    return [
        'Choose resume command:',
        '/frontend_resume',
        '/backend_resume',
        '/fullstack_resume',
        '/faang_resume',
        '/sde_resume',
        '/dev_resume',
        '',
        'Or use: /resume frontend (old style still works).'
    ].join('\n');
}

function resumeCommandToDomain(command) {
    const map = {
        '/frontend_resume': 'frontend',
        '/backend_resume': 'backend',
        '/fullstack_resume': 'fullstack',
        '/faang_resume': 'faang',
        '/sde_resume': 'sde',
        '/dev_resume': 'dev'
    };

    return map[command.toLowerCase()] || null;
}


function portfolioMessage() {
    return [
        '🌐 Avinash Portfolio',
        '',
        'Check out my work, projects, and experience here 👇',
        profile.links.portfolio
    ].join('\n');
}

function sendResumeByDomain(chatId, domain) {
    const pdfPath = getResumePdfPath(domain);
    if (!pdfPath) {
        bot.sendMessage(chatId, `Resume PDF not found for "${domain}". Please verify file in assets folder.`);
        return;
    }

    const title = resumeProfiles[domain] ? resumeProfiles[domain].title : `Resume (${domain})`;
    bot.sendDocument(chatId, pdfPath, {
        caption: `📄 ${title}\n${profile.name} | ${profile.title}`
    });
}

function getResumePdfPath(domainKey) {
    const fileName = resumeFiles[domainKey];
    if (!fileName) return null;

    const absolutePath = path.join(__dirname, 'assets', fileName);
    return fs.existsSync(absolutePath) ? absolutePath : null;
}

function quickReplyKeyboard() {
    return {
        keyboard: [
            ['/about', '/skills'],
            ['/projects', '/portfolio'],
            ['/projects', '/experience'],
            ['/frontend_resume', '/backend_resume'],
            ['/fullstack_resume', '/faang_resume'],
            ['/sde_resume', '/dev_resume'],
            ['/contact', '/links'],
            ['/help', '/status']
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    };
}

function resumeDomainMessage(domainKey) {
    const domain = resumeProfiles[domainKey];
    if (!domain) return availableResumeDomainsMessage();

    return [
        `📄 ${domain.title}`,
        `Name: ${profile.name}`,
        `Role: ${profile.title}`,
        `Objective: ${domain.objective}`,
        '',
        'Top Highlights:',
        `- ${domain.highlights.join('\n- ')}`,
        '',
        `Relevant Projects: ${domain.fitProjects.join(', ')}`,
        `Core Stack: ${domain.stack.join(', ')}`,
        '',
        `Contact: ${profile.email} | ${profile.phone}`,
        `Portfolio: ${profile.links.portfolio}`,
        `GitHub: ${profile.links.github}`,
        `LinkedIn: ${profile.links.linkedin}`
    ].join('\n');
}

function aboutMessage() {
    return `👋 ${profile.name}\n${profile.title}\n\n${profile.summary}`;
}

function skillsMessage() {
    return [
        '🛠 Skills',
        `Languages: ${profile.skills.languages.join(', ')}`,
        `Frontend: ${profile.skills.frontend.join(', ')}`,
        `Backend: ${profile.skills.backend.join(', ')}`,
        `Realtime/Cloud: ${profile.skills.realtimeCloud.join(', ')}`,
        `CS Fundamentals: ${profile.skills.csFundamentals.join(', ')}`
    ].join('\n');
}

function projectsMessage() {
    const projectList = profile.projects
        .map((project, index) => `${index + 1}. ${project.name} (${project.stack})\n   - ${project.gist}`)
        .join('\n');
    return `📌 Project Highlights\n${projectList}`;
}

function experienceMessage() {
    const experienceList = profile.experience
        .map(
            (item, index) =>
                `${index + 1}. ${item.role} @ ${item.company} (${item.period})\n   - ${item.highlights.join('\n   - ')}`
        )
        .join('\n');
    return `💼 Experience\n${experienceList}`;
}

function educationMessage() {
    return [
        '🎓 Education',
        `${profile.education.degree}`,
        `${profile.education.college}`,
        `${profile.education.duration} | CGPA: ${profile.education.cgpa}`
    ].join('\n');
}

function certificationsMessage() {
    return `📜 Certifications\n- ${profile.certifications.join('\n- ')}`;
}

function contactMessage() {
    return [
        '📞 Contact',
        `Phone: ${profile.phone}`,
        `Email: ${profile.email}`,
        `Location: ${profile.location}`
    ].join('\n');
}

function linksMessage() {
    return [
        '🔗 Links',
        `Portfolio: ${profile.links.portfolio}`,
        `GitHub: ${profile.links.github}`,
        `LinkedIn: ${profile.links.linkedin}`,
        `LeetCode: ${profile.links.leetcode}`,
        `HackerRank: ${profile.links.hackerrank}`,
        `CodeChef: ${profile.links.codechef}`,
        `Codeforces: ${profile.links.codeforces}`
    ].join('\n');
}

function getIntentReply(text) {
    const message = text.toLowerCase();

    if (/(^|\b)(hi|hello|hey|namaste)(\b|$)/.test(message)) {
        return `Hey! 👋 I am ${profile.name}'s assistant. Type /help to explore everything I can share.`;
    }

    if (/(thanks|thank you|thx)/.test(message)) {
        return 'Happy to help! If you want, ask me for /resume backend, /resume fullstack, or /resume faang next.';
    }

    if (/(resume|cv)/.test(message)) {
        const possibleDomain = normalizeResumeDomain(message);
        return possibleDomain
            ? `Use /resume ${possibleDomain} and I will send the PDF.`
            : availableResumeDomainsMessage();
    }

    if (/(who|about|summary|introduce)/.test(message)) return aboutMessage();
    if (/(skill|tech|stack|language)/.test(message)) return skillsMessage();
    if (/(portfolio|website|site)/.test(message)) return portfolioMessage();
    if (/(project|work|build)/.test(message))return projectsMessage();
    if (/(intern|experience|job|epicircle|ideovent)/.test(message)) return experienceMessage();
    if (/(education|college|degree|cgpa)/.test(message)) return educationMessage();
    if (/(certification|certificate|nptel)/.test(message)) return certificationsMessage();
    if (/(contact|phone|email|location|reach)/.test(message)) return contactMessage();
    if (/(github|linkedin|leetcode|hackerrank|codechef|codeforces|link)/.test(message)) return linksMessage();

    return [
        'I can help with Avinash profile details. Try asking:',
        '- about',
        '- skills',
        '- projects',
        '- experience',
        '- education',
        '- certifications',
        '- contact',
        '- links',
        '- resume frontend/backend/fullstack/faang/sde/dev',
        '',
        'Or type /help or /menu'
    ].join('\n');
}

// /start command
bot.onText(/\/start/, (msg) => {
    const welcome = [
        `Hi! I am ${profile.name}'s assistant 🤖`,
        'I can help others know about Avinash: skills, projects, experience, education, and contact details.',
        'I can also send domain-specific resume PDFs.',
        '',
        'Type /help to see commands or use the keyboard menu below.'
    ].join('\n');
    bot.sendMessage(msg.chat.id, welcome, { reply_markup: quickReplyKeyboard() });
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, helpMessage);
});

bot.onText(/\/menu/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Quick menu enabled ✅', { reply_markup: quickReplyKeyboard() });
});

bot.onText(/\/about/, (msg) => {
    bot.sendMessage(msg.chat.id, aboutMessage());
});

bot.onText(/\/resume(?:\s+(.+))?/, (msg, match) => {
    const input = (match && match[1]) ? match[1].trim() : '';
    if (!input) {
        bot.sendMessage(msg.chat.id, availableResumeDomainsMessage());
        return;
    }

    const domain = normalizeResumeDomain(input);
    if (!domain) {
        bot.sendMessage(msg.chat.id, `Unknown domain: "${input}"\n\n${availableResumeDomainsMessage()}`);
        return;
    }

    sendResumeByDomain(msg.chat.id, domain);
});

bot.onText(/\/(frontend|backend|fullstack|faang|sde|dev)_resume/, (msg) => {
    const command = msg.text.split(' ')[0];
    const domain = resumeCommandToDomain(command);
    if (!domain) {
        bot.sendMessage(msg.chat.id, availableResumeDomainsMessage());
        return;
    }

    sendResumeByDomain(msg.chat.id, domain);
});


bot.onText(/\/portfolio/, (msg) => {
    bot.sendMessage(msg.chat.id, portfolioMessage());
});


bot.onText(/\/status/, (msg) => {
    const uptimeSeconds = Math.floor((Date.now() - startedAt) / 1000);
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    const uptime = `${hours}h ${minutes}m ${seconds}s`;

    bot.sendMessage(
        msg.chat.id,
        [
            '✅ Bot Status',
            `Mode: ${useWebhook ? 'Webhook (Render)' : 'Polling (Local)'}`,
            `Uptime: ${uptime}`,
            `Service Port: ${port}`
        ].join('\n')
    );
});

bot.onText(/\/skills/, (msg) => {
    bot.sendMessage(msg.chat.id, skillsMessage());
});

bot.onText(/\/projects/, (msg) => {
    bot.sendMessage(msg.chat.id, projectsMessage());
});

bot.onText(/\/experience/, (msg) => {
    bot.sendMessage(msg.chat.id, experienceMessage());
});

bot.onText(/\/education/, (msg) => {
    bot.sendMessage(msg.chat.id, educationMessage());
});

bot.onText(/\/certifications/, (msg) => {
    bot.sendMessage(msg.chat.id, certificationsMessage());
});

bot.onText(/\/contact/, (msg) => {
    bot.sendMessage(msg.chat.id, contactMessage());
});

bot.onText(/\/links/, (msg) => {
    bot.sendMessage(msg.chat.id, linksMessage());
});

// reply to any message
bot.on('message', (msg) => {
    if (!msg.text) return;

    if (msg.text.startsWith('/')) {
        const command = msg.text.split(' ')[0].toLowerCase();
        if (!knownCommands.has(command)) {
            bot.sendMessage(msg.chat.id, `Unknown command: ${command}\nType /help or /menu to continue.`);
        }
        return;
    }

    bot.sendMessage(msg.chat.id, getIntentReply(msg.text));
});

bot.on('polling_error', (error) => {
    console.error('Telegram polling error:', error.message);
});

bot.on('webhook_error', (error) => {
    console.error('Telegram webhook error:', error.message);
});

async function bootstrap() {
    await bot.setMyCommands([
        { command: 'start', description: 'Start Avinash Assistant' },
        { command: 'help', description: 'Show what I can answer' },
        { command: 'menu', description: 'Open quick command keyboard' },
        { command: 'about', description: 'Get profile summary' },
        { command: 'resume', description: 'Show resume command shortcuts' },
        { command: 'frontend_resume', description: 'Send Frontend resume PDF' },
        { command: 'backend_resume', description: 'Send Backend resume PDF' },
        { command: 'fullstack_resume', description: 'Send FullStack resume PDF' },
        { command: 'faang_resume', description: 'Send FAANG resume PDF' },
        { command: 'sde_resume', description: 'Send SDE resume PDF' },
        { command: 'dev_resume', description: 'Send Dev resume PDF' },
        { command: 'skills', description: 'See technical skills' },
        { command: 'projects', description: 'See project highlights' },
        { command: 'experience', description: 'See internship experience' },
        { command: 'education', description: 'See education details' },
        { command: 'certifications', description: 'See certifications' },
        { command: 'contact', description: 'Get contact details' },
        { command: 'links', description: 'Get social/coding links' },
        { command: 'portfolio', description: 'Open Avinash portfolio website' },
        { command: 'status', description: 'Check bot runtime status' }
    ]);

    if (useWebhook) {
        const externalBaseUrl = (process.env.TELEGRAM_WEBHOOK_URL || process.env.RENDER_EXTERNAL_URL || '').replace(/\/$/, '');

        if (!externalBaseUrl) {
            throw new Error('Webhook mode is enabled but TELEGRAM_WEBHOOK_URL/RENDER_EXTERNAL_URL is missing.');
        }

        const finalWebhookUrl = `${externalBaseUrl}${webhookPath}`;
        await bot.setWebHook(finalWebhookUrl, telegramSecretToken ? { secret_token: telegramSecretToken } : undefined);
        console.log(`Webhook mode active at ${finalWebhookUrl}`);
    } else {
        await bot.deleteWebHook();
        console.log('Polling mode active for local development.');
    }

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

bootstrap().catch((error) => {
    console.error('Failed to bootstrap bot:', error.message);
    process.exit(1);
});