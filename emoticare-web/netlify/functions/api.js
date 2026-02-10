const express = require('express');
const serverless = require('serverless-http');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Init Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Init OpenAI (Connect to Zhipu GLM)
const openai = process.env.GLM_API_KEY 
  ? new OpenAI({ 
      apiKey: process.env.GLM_API_KEY,
      baseURL: "https://open.bigmodel.cn/api/paas/v4/"
    })
  : null;

// Middleware
app.use(express.json());

// Routes
const router = express.Router();

router.get('/hello', (req, res) => {
  res.send('EmotiCare Netlify Function is running 🚀');
});

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    let reply;

    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: "你叫 Mio，是一个温暖、真实、稍微带点幽默感的朋友。你的目标是提供情绪价值和建议。拒绝说教，拒绝爹味，拒绝虚假的鸡汤。用简洁、口语化的中文回答。如果用户抱怨累，就陪他一起吐槽；如果用户求安慰，就给他一个云拥抱。" },
            { role: "user", content: message }
          ],
          model: "glm-4",
          temperature: 0.7,
        });
        reply = completion.choices[0].message.content;
      } catch (err) {
        console.error('GLM API Failed:', err.message);
        reply = "AI 好像在打盹（API 报错），但我还在。要不你先喝杯水休息下？🥤";
      }
    } else {
      reply = "Mock: 抱歉，我还没连接到大脑（API Key 未配置）。";
    }

    // Save to Supabase
    if (supabase) {
      try {
        await supabase
          .from('messages')
          .insert([
            { role: 'user', content: message, created_at: new Date() },
            { role: 'ai', content: reply, created_at: new Date() }
          ]);
      } catch (dbErr) {
        console.error('Supabase Error:', dbErr);
      }
    }

    res.json({ reply });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Attach router to path
app.use('/.netlify/functions/api', router);
app.use('/api', router); // Local fallback

module.exports.handler = serverless(app);
