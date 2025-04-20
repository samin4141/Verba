export interface SpeakingPrompt {
  id: string;
  prompt: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'daily life' | 'work' | 'travel' | 'opinion' | 'scenario';
  timeLimit: number; // in seconds
  sampleAnswer?: string;
}

export const speakingPrompts: SpeakingPrompt[] = [
  {
    id: 'introduce-yourself',
    prompt: "Introduce yourself. Talk about your name, age, where you are from, your job or studies, and your hobbies.",
    level: 'beginner',
    category: 'daily life',
    timeLimit: 60,
    sampleAnswer: "Hello! My name is John Smith. I'm 28 years old and I'm from Toronto, Canada. I work as a software engineer at a tech company. In my free time, I enjoy playing basketball, reading science fiction books, and traveling. I've visited ten countries so far, and I hope to visit many more in the future."
  },
  {
    id: 'describe-family',
    prompt: "Describe your family. Talk about your parents, siblings, and other family members. What do they do? What are they like?",
    level: 'beginner',
    category: 'daily life',
    timeLimit: 90,
    sampleAnswer: "I have a small family. My father is a teacher and my mother is a nurse. They both work very hard. I have one older sister who is married and lives in another city. She works as an architect. My grandparents live close to us, and we visit them every weekend. My grandfather was a farmer, but he's retired now. My grandmother still loves to cook for the whole family. We're very close and support each other."
  },
  {
    id: 'favorite-food',
    prompt: "What is your favorite food? Describe what it is, how it's prepared, and why you like it.",
    level: 'beginner',
    category: 'daily life',
    timeLimit: 60,
    sampleAnswer: "My favorite food is pasta with seafood. It's made with spaghetti, various types of seafood like shrimp and mussels, garlic, olive oil, and fresh herbs. I love it because the combination of flavors is amazing. The seafood is fresh and the pasta is always cooked perfectly. I especially enjoy eating it at a small restaurant near my home where they make it with locally caught seafood. It reminds me of my vacation in Italy where I first tried this dish."
  },
  {
    id: 'weekend-activities',
    prompt: "What do you usually do on weekends? Describe your typical weekend activities.",
    level: 'beginner',
    category: 'daily life',
    timeLimit: 60,
    sampleAnswer: "On weekends, I like to relax and spend time with friends and family. On Saturday mornings, I usually go for a run in the park near my house. In the afternoon, I might go shopping or watch a movie. Saturday evenings are for socializing - I often meet friends for dinner or drinks. On Sundays, I prefer to stay at home. I clean my apartment, do laundry, and prepare meals for the upcoming week. I also call my parents who live in another city. Sometimes, I read a book or watch TV shows. Weekends are important for me to recharge before the new work week begins."
  },
  {
    id: 'job-interview',
    prompt: "Imagine you are in a job interview. Describe your strengths, weaknesses, and why you are suitable for the position.",
    level: 'intermediate',
    category: 'work',
    timeLimit: 120,
    sampleAnswer: "I believe my greatest strength is my ability to solve problems efficiently. I enjoy analyzing complex situations and finding creative solutions. For example, in my previous role, I developed a new system that reduced processing time by 30%. I'm also a strong team player who values collaboration and open communication. As for weaknesses, I sometimes struggle with delegating tasks as I want to ensure everything is done perfectly. However, I've been working on this by trusting my team members more and focusing on providing clear instructions instead of trying to do everything myself. I believe I'm suitable for this position because my experience in project management aligns perfectly with the job requirements. I've successfully led teams of various sizes and delivered projects on time and within budget. Additionally, I'm passionate about this industry and constantly strive to stay updated with the latest trends and technologies."
  },
  {
    id: 'travel-experience',
    prompt: "Describe a memorable travel experience. Where did you go? What did you do? Why was it memorable?",
    level: 'intermediate',
    category: 'travel',
    timeLimit: 120,
    sampleAnswer: "One of my most memorable travel experiences was my trip to Japan three years ago. I spent two weeks exploring Tokyo, Kyoto, and Osaka. In Tokyo, I was amazed by the blend of ultra-modern technology and traditional culture. I visited ancient temples right next to futuristic skyscrapers. The food was incredible - I tried everything from street food to high-end sushi restaurants. What made this trip particularly memorable was the kindness of the local people. Despite the language barrier, everyone was extremely helpful. One evening, when I got lost in Tokyo, an elderly man not only gave me directions but actually walked with me for 15 minutes to ensure I found my destination. The efficiency of the public transportation system was also impressive - trains arrived exactly on time, to the second. This trip changed my perspective on many things, from the importance of respecting traditions to the value of precision and attention to detail."
  },
  {
    id: 'technology-impact',
    prompt: "How has technology impacted our daily lives? Discuss both positive and negative effects.",
    level: 'intermediate',
    category: 'opinion',
    timeLimit: 150,
    sampleAnswer: "Technology has fundamentally transformed our daily lives in numerous ways. On the positive side, it has made communication faster and more convenient. We can instantly connect with people across the globe through video calls and messaging apps. Information is now at our fingertips - we can learn about virtually any topic online. Technology has also improved healthcare through advanced diagnostic tools and treatments. In the workplace, automation has eliminated many repetitive tasks, potentially allowing humans to focus on more creative and fulfilling work. However, there are also significant downsides. Many people experience digital addiction and struggle to disconnect from their devices. Social media, while connecting us in some ways, has been linked to increased feelings of loneliness and depression. Privacy concerns are growing as companies collect vast amounts of personal data. Job displacement due to automation is a real concern for many workers. Additionally, the digital divide means that not everyone has equal access to technological benefits. Overall, I believe technology itself is neutral - it's how we choose to use and regulate it that determines its impact on society."
  },
  {
    id: 'environmental-solutions',
    prompt: "What do you think are the most effective solutions to environmental problems? Explain your reasoning.",
    level: 'advanced',
    category: 'opinion',
    timeLimit: 180,
    sampleAnswer: "Addressing environmental challenges requires a multifaceted approach combining individual action, policy changes, and technological innovation. I believe one of the most effective solutions is transitioning to renewable energy sources like solar, wind, and hydroelectric power. This would significantly reduce greenhouse gas emissions while potentially creating new economic opportunities. Carbon pricing mechanisms, whether through taxes or cap-and-trade systems, are also crucial as they incorporate environmental costs into market decisions and incentivize cleaner practices. Regarding consumption patterns, we need to move toward a circular economy where products are designed for durability, repairability, and eventual recycling. This would minimize waste and resource extraction. Protecting and restoring natural carbon sinks such as forests and wetlands is another vital strategy that offers co-benefits for biodiversity. On the individual level, dietary shifts toward more plant-based foods could substantially reduce environmental impacts, as animal agriculture is a major contributor to emissions, deforestation, and water pollution. Education and awareness are foundational to all these solutions, as they drive both personal choices and political will for systemic change. While technological solutions like carbon capture show promise, we shouldn't rely on future innovations to solve problems we can address with existing knowledge and tools. Ultimately, the most effective approach combines immediate action using proven methods with continued investment in research and development for emerging solutions."
  },
  {
    id: 'cultural-differences',
    prompt: "Discuss cultural differences you have experienced or observed. How do these differences affect communication and understanding between people?",
    level: 'advanced',
    category: 'opinion',
    timeLimit: 180,
    sampleAnswer: "Cultural differences manifest in countless aspects of human interaction, from communication styles to values and social norms. In my experience working with international teams, I've observed how these differences can significantly impact collaboration. For instance, in some cultures, direct communication is valued - people express opinions clearly and directly address conflicts. In others, communication is more indirect, with an emphasis on preserving harmony and avoiding confrontation. Neither approach is inherently superior, but misunderstandings can arise when these styles interact without mutual awareness. Time perception also varies dramatically across cultures. Some societies operate with a strict adherence to schedules and deadlines - what anthropologists call 'monochronic' time orientation. Others take a more flexible, 'polychronic' approach where relationships often take precedence over punctuality. These differences can create friction in professional settings if not properly understood and accommodated. Hierarchical relationships are another area of significant variation. Some cultures maintain strict power distances between different organizational levels, while others are more egalitarian. This affects everything from decision-making processes to how feedback is given and received. The concept of individualism versus collectivism represents perhaps the most fundamental cultural divide. Western societies typically emphasize individual achievement and personal rights, while many Eastern and Southern cultures prioritize group harmony and collective responsibility. These different orientations shape people's core identities and value systems. To bridge these differences effectively, I believe we need to develop cultural intelligence - the ability to recognize cultural variations without judgment, adapt our behavior appropriately, and find common ground. This requires genuine curiosity, humility, and a willingness to question our own cultural assumptions. Organizations can support this through cross-cultural training, diverse teams, and creating space for open dialogue about cultural differences. Ultimately, cultural diversity, when properly leveraged, becomes a tremendous asset, bringing together complementary perspectives and approaches to solve complex problems."
  },
  {
    id: 'negotiation-scenario',
    prompt: "Imagine you are negotiating the price of a used car. The seller is asking for $10,000, but you think it's worth $8,000. Role-play this negotiation, explaining your reasoning and trying to reach a compromise.",
    level: 'advanced',
    category: 'scenario',
    timeLimit: 150,
    sampleAnswer: "Hello, I'm interested in purchasing this car, and I appreciate you showing it to me today. I've done some research on this particular model, year, and mileage, and I've found that similar vehicles in this condition are selling for around $8,000 in our area. I understand you're asking $10,000, but I'd like to explain why I believe that's above the market value. First, I noticed the car has over 70,000 miles, which is relatively high for its age. Second, there are some visible scratches on the rear bumper that would need to be repaired. Additionally, the technology package is the basic version, not the premium one that would justify a higher price point. That said, I do recognize that the car has been well-maintained mechanically, and the interior is in excellent condition. The service records you've provided show consistent maintenance, which I value highly. Taking all these factors into account, I'm prepared to offer $8,000, which I believe is fair based on the current market. However, I'm willing to discuss a price that works for both of us. Perhaps we could meet in the middle at $9,000? Alternatively, if you're firm on your asking price, would you be willing to include the new set of winter tires you mentioned or cover the cost of the bumper repair? I'm flexible and genuinely interested in the car, so I'm confident we can find a solution that satisfies both of us."
  }
];