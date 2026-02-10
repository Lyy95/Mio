const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Init Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (!supabase) {
  console.log('⚠️ Supabase config missing. Chat history will NOT be saved.');
}

// Middleware
app.use(cors());
app.use(express.json());

// Init OpenAI (Connect to Zhipu GLM)
const openai = process.env.GLM_API_KEY 
  ? new OpenAI({ 
      apiKey: process.env.GLM_API_KEY,
      baseURL: "https://open.bigmodel.cn/api/paas/v4/" // GLM API Endpoint
    })
  : null;

// Routes
app.get('/', (req, res) => {
  res.send('EmotiCare API is running 🚀');
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    let reply;

    if (openai) {
      // Real AI Response via GLM
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: "你叫 EmotiCare，是一个温暖、真实、稍微带点幽默感的朋友。你的目标是提供情绪价值和建议。拒绝说教，拒绝爹味，拒绝虚假的鸡汤。用简洁、口语化的中文回答。如果用户抱怨累，就陪他一起吐槽；如果用户求安慰，就给他一个云拥抱。" },
            { role: "user", content: message }
          ],
          model: "glm-4", // GLM Model
          temperature: 0.7,
        });
        reply = completion.choices[0].message.content;
      } catch (err) {
        console.error('GLM API Failed:', err.message);
        console.log('⚠️ Falling back to mock response due to API error.');
        reply = "AI 好像在打盹（API 报错），但我还在。要不你先喝杯水休息下？🥤";
      }
    } else {
      // Mock Response (Fallback)
      console.log('⚠️ No OpenAI Key found, using mock response.');
      const mockReplies = [
        "唉，这确实挺烦人的。要不先把手头的事放一放，去楼下便利店买瓶快乐水？🥤",
        "太真实了，我也经常有这种感觉。这种时候就别逼自己了，允许自己摆烂一会儿也没事。",
        "这种破事谁遇到都会炸毛的。你已经忍得很好了，想骂就骂两句吧。",
        "工作是做不完的，身体是自己的。听我的，哪怕就十分钟，把手机扔远点，闭眼躺会儿。",
        "感觉你现在像个高压锅。要不要去洗把脸降降温？或者吃顿好的发泄一下？"
      ];
      reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
    }

    // Save to Supabase (if configured)
    if (supabase) {
      console.log('Attempting to save to Supabase...');
      const { error } = await supabase
        .from('messages')
        .insert([
          { role: 'user', content: message, created_at: new Date() },
          { role: 'ai', content: reply, created_at: new Date() }
        ]);
      
      if (error) {
        console.error('❌ Supabase Save Error:', error.message);
        console.error('Error Details:', error);
      } else {
        console.log('✅ Chat saved to Supabase successfully');
      }
    }

    res.json({ reply });

  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
