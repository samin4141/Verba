
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Book, Clock, Star, ArrowLeft } from "lucide-react";

interface ReadingSectionProps {
  userLevel: number;
}

const ReadingSection = ({ userLevel }: ReadingSectionProps) => {
  const [currentMode, setCurrentMode] = useState<'practice' | 'test'>('practice');
  const [currentPassage, setCurrentPassage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  // Multiple passages for IELTS-style test
  const getPassages = () => {
    if (userLevel < 10) {
      return [
        {
          title: "The Benefits of Reading",
          text: "Reading is one of the most important skills a person can develop. When we read regularly, we improve our vocabulary and understanding of language. Books can take us to different places and times without leaving our homes. They help us learn about other cultures and ways of life. Reading also helps us think better and solve problems more easily. Many successful people say that reading has been key to their success. Research shows that people who read for just 30 minutes a day can significantly improve their cognitive abilities. Reading fiction helps develop empathy as we experience life through different characters' perspectives. Non-fiction reading expands our knowledge base and helps us understand complex topics. The habit of reading should be developed from an early age to maximize its benefits throughout life.",
          difficulty: "Beginner",
          estimatedTime: 20,
          questions: [
            {
              question: "What is the main benefit of reading mentioned in the passage?",
              options: ["Entertainment", "Improving vocabulary and language understanding", "Making money", "Meeting people"],
              correct: "Improving vocabulary and language understanding"
            },
            {
              question: "According to the passage, reading for 30 minutes daily can:",
              options: ["Make you tired", "Improve cognitive abilities", "Waste time", "Cause headaches"],
              correct: "Improve cognitive abilities"
            },
            {
              question: "Reading fiction helps develop:",
              options: ["Mathematical skills", "Empathy", "Physical strength", "Memory only"],
              correct: "Empathy"
            },
            {
              question: "When should the reading habit be developed?",
              options: ["In old age", "Only in school", "From an early age", "Never"],
              correct: "From an early age"
            }
          ]
        },
        {
          title: "Animals in the Wild",
          text: "Wild animals live in their natural habitats without human care. They must find their own food, water, and shelter. Different animals have different ways of surviving in the wild. Some animals, like lions, hunt other animals for food. Others, like rabbits, eat plants and grass. Birds build nests in trees to protect their babies. Fish swim in rivers, lakes, and oceans. Many animals migrate, which means they travel long distances to find food or escape cold weather. For example, some birds fly south in winter and return north in spring. Animals in the wild face many challenges, including finding enough food and avoiding predators. Climate change is making life harder for many wild animals as their habitats change. People can help by protecting natural areas and reducing pollution.",
          difficulty: "Beginner",
          estimatedTime: 20,
          questions: [
            {
              question: "What do wild animals need to find for themselves?",
              options: ["Only food", "Food, water, and shelter", "Only water", "Only shelter"],
              correct: "Food, water, and shelter"
            },
            {
              question: "What does 'migrate' mean according to the passage?",
              options: ["Sleep all winter", "Travel long distances", "Build nests", "Hunt for food"],
              correct: "Travel long distances"
            },
            {
              question: "What is making life harder for wild animals?",
              options: ["Other animals", "Climate change", "Too much food", "Building nests"],
              correct: "Climate change"
            },
            {
              question: "How can people help wild animals?",
              options: ["By hunting them", "By protecting natural areas", "By feeding them daily", "By keeping them as pets"],
              correct: "By protecting natural areas"
            }
          ]
        },
        {
          title: "Technology in Daily Life",
          text: "Technology has become an important part of our daily lives. We use smartphones to communicate with friends and family. Computers help us work and study. The internet allows us to find information quickly and easily. Many people use social media to share photos and stay connected with others. Technology has made many tasks faster and more convenient. For example, we can now shop online instead of going to stores. We can watch movies at home instead of going to the cinema. However, technology also has some disadvantages. Some people spend too much time looking at screens, which can be bad for their health. Others worry about privacy and security when using the internet. It is important to use technology wisely and find a good balance between online and offline activities.",
          difficulty: "Beginner",
          estimatedTime: 20,
          questions: [
            {
              question: "What has technology become in our lives?",
              options: ["Unimportant", "An important part", "A small part", "Unnecessary"],
              correct: "An important part"
            },
            {
              question: "What advantage of technology is mentioned?",
              options: ["Makes tasks slower", "Makes tasks faster and more convenient", "Makes tasks harder", "Makes tasks impossible"],
              correct: "Makes tasks faster and more convenient"
            },
            {
              question: "What health concern is mentioned about technology?",
              options: ["Too little screen time", "Too much screen time", "Not using phones", "Reading books"],
              correct: "Too much screen time"
            },
            {
              question: "What is important when using technology?",
              options: ["Using it all the time", "Never using it", "Using it wisely and finding balance", "Only using it for work"],
              correct: "Using it wisely and finding balance"
            }
          ]
        }
      ];
    } else if (userLevel < 20) {
      return [
        {
          title: "The Impact of Technology on Education",
          text: "The integration of technology in educational institutions has fundamentally transformed the learning landscape. Digital platforms have democratized access to information, enabling students from diverse backgrounds to engage with high-quality educational content. However, this technological revolution presents both opportunities and challenges. While interactive learning tools can enhance student engagement and provide personalized learning experiences, educators must navigate concerns about screen time, digital divides, and the potential loss of traditional pedagogical methods. The key lies in striking a balance between leveraging technological advantages while preserving the human elements that make education meaningful. Studies indicate that blended learning approaches, which combine digital and face-to-face instruction, often yield the most effective results. Furthermore, the pandemic has accelerated the adoption of online learning platforms, revealing both their potential and limitations. As we move forward, educational institutions must carefully consider how to integrate technology in ways that truly enhance learning outcomes rather than simply digitizing traditional methods.",
          difficulty: "Intermediate",
          estimatedTime: 20,
          questions: [
            {
              question: "What has technology done to access to information in education?",
              options: ["Limited it", "Democratized it", "Eliminated it", "Complicated it"],
              correct: "Democratized it"
            },
            {
              question: "What type of learning approach is mentioned as most effective?",
              options: ["Only digital", "Only traditional", "Blended learning", "No learning"],
              correct: "Blended learning"
            },
            {
              question: "What did the pandemic do to online learning adoption?",
              options: ["Slowed it down", "Stopped it", "Accelerated it", "Had no effect"],
              correct: "Accelerated it"
            },
            {
              question: "What should institutions consider when integrating technology?",
              options: ["How to enhance learning outcomes", "How to save money", "How to eliminate teachers", "How to reduce access"],
              correct: "How to enhance learning outcomes"
            },
            {
              question: "What concern do educators have about technology?",
              options: ["It's too cheap", "Digital divides and screen time", "It's too simple", "It's too traditional"],
              correct: "Digital divides and screen time"
            }
          ]
        },
        {
          title: "Urban Planning and Sustainable Cities",
          text: "Modern urban planning faces the complex challenge of creating sustainable cities that can accommodate growing populations while minimizing environmental impact. Urban planners must consider multiple factors including transportation networks, housing availability, green spaces, and infrastructure development. The concept of 'smart cities' has emerged as a potential solution, incorporating technology to optimize resource usage and improve quality of life for residents. However, implementing smart city initiatives requires significant investment and careful planning to ensure that technological solutions address real urban problems rather than creating new ones. Successful urban development also depends on community engagement and ensuring that development projects serve the needs of all residents, not just affluent populations. The challenge of gentrification often accompanies urban renewal projects, potentially displacing long-term residents. Therefore, sustainable urban planning must balance economic development with social equity and environmental protection.",
          difficulty: "Intermediate",
          estimatedTime: 20,
          questions: [
            {
              question: "What is the main challenge of modern urban planning?",
              options: ["Creating sustainable cities", "Building more roads", "Reducing populations", "Eliminating technology"],
              correct: "Creating sustainable cities"
            },
            {
              question: "What does the concept of 'smart cities' aim to do?",
              options: ["Increase pollution", "Optimize resource usage", "Reduce technology", "Eliminate residents"],
              correct: "Optimize resource usage"
            },
            {
              question: "What often accompanies urban renewal projects?",
              options: ["Population decrease", "Gentrification", "Technology reduction", "Environmental damage"],
              correct: "Gentrification"
            },
            {
              question: "What must sustainable urban planning balance?",
              options: ["Only economic factors", "Economic development with social equity", "Only environmental factors", "Only social factors"],
              correct: "Economic development with social equity"
            },
            {
              question: "What is required for successful smart city initiatives?",
              options: ["No investment", "Significant investment and planning", "Only technology", "Only community input"],
              correct: "Significant investment and planning"
            }
          ]
        },
        {
          title: "Climate Change and Agriculture",
          text: "Climate change poses significant challenges to global agriculture, affecting crop yields, soil quality, and water availability. Rising temperatures and changing precipitation patterns are forcing farmers to adapt their practices and consider alternative crops that are more resilient to extreme weather conditions. Traditional farming methods that have been used for generations may no longer be viable in many regions. Agricultural scientists are developing drought-resistant crops and improving irrigation techniques to help farmers cope with water scarcity. Additionally, sustainable farming practices such as crop rotation and organic farming are gaining importance as they help maintain soil health and reduce environmental impact. The challenge is particularly acute in developing countries where farmers may lack access to new technologies and climate-resilient seeds. International cooperation and knowledge sharing are essential to help farmers worldwide adapt to climate change and ensure food security for future generations.",
          difficulty: "Intermediate",
          estimatedTime: 20,
          questions: [
            {
              question: "What is climate change affecting in agriculture?",
              options: ["Only crop yields", "Crop yields, soil quality, and water availability", "Only water", "Only soil"],
              correct: "Crop yields, soil quality, and water availability"
            },
            {
              question: "What are farmers being forced to consider?",
              options: ["Traditional methods only", "Alternative resilient crops", "No changes", "Less farming"],
              correct: "Alternative resilient crops"
            },
            {
              question: "What are sustainable farming practices helping to maintain?",
              options: ["High costs", "Soil health", "Water waste", "Chemical use"],
              correct: "Soil health"
            },
            {
              question: "Where is the challenge particularly acute?",
              options: ["Developed countries", "Developing countries", "Cold countries", "Island countries"],
              correct: "Developing countries"
            },
            {
              question: "What is essential for helping farmers adapt?",
              options: ["Isolation", "International cooperation", "Competition", "Individual effort only"],
              correct: "International cooperation"
            }
          ]
        }
      ];
    } else {
      return [
        {
          title: "Quantum Computing and Cryptography",
          text: "The advent of quantum computing represents a paradigmatic shift that threatens to render contemporary cryptographic protocols obsolete. Unlike classical computers that process information in binary states, quantum computers leverage quantum mechanical phenomena such as superposition and entanglement to perform calculations exponentially faster for certain problems. This computational advantage poses an existential threat to current encryption methods, particularly those relying on the computational difficulty of integer factorization and discrete logarithm problems. Consequently, cryptographers are racing to develop quantum-resistant algorithms that can withstand attacks from both classical and quantum adversaries, ushering in the era of post-quantum cryptography. The implications extend beyond mere academic interest; financial institutions, government agencies, and private corporations must begin transitioning to quantum-safe protocols to protect sensitive information. The National Institute of Standards and Technology has been actively standardizing post-quantum cryptographic algorithms, recognizing the urgency of this transition. However, the implementation challenges are substantial, requiring significant infrastructure changes and careful consideration of performance trade-offs. The timeline for widespread quantum computer deployment remains uncertain, but the cryptographic community emphasizes the importance of beginning the transition now, given the lengthy process of updating security systems across various industries.",
          difficulty: "Advanced",
          estimatedTime: 20,
          questions: [
            {
              question: "What does quantum computing threaten to make obsolete?",
              options: ["Classical computers", "Contemporary cryptographic protocols", "Internet connections", "Mobile phones"],
              correct: "Contemporary cryptographic protocols"
            },
            {
              question: "What quantum mechanical phenomena do quantum computers leverage?",
              options: ["Superposition and entanglement", "Gravity and magnetism", "Heat and light", "Sound and vibration"],
              correct: "Superposition and entanglement"
            },
            {
              question: "What are cryptographers developing in response?",
              options: ["Faster classical computers", "Quantum-resistant algorithms", "New internet protocols", "Better passwords"],
              correct: "Quantum-resistant algorithms"
            },
            {
              question: "Which institution has been standardizing post-quantum cryptographic algorithms?",
              options: ["United Nations", "World Bank", "National Institute of Standards and Technology", "International Space Station"],
              correct: "National Institute of Standards and Technology"
            },
            {
              question: "What makes implementation challenging?",
              options: ["Lack of interest", "Substantial infrastructure changes", "Too much money", "Simple processes"],
              correct: "Substantial infrastructure changes"
            }
          ]
        },
        {
          title: "Neuroscience and Artificial Intelligence",
          text: "The intersection of neuroscience and artificial intelligence represents one of the most fascinating frontiers in contemporary scientific research. As our understanding of neural networks in the human brain deepens, researchers are drawing increasingly sophisticated parallels to artificial neural networks used in machine learning. This convergence has led to breakthrough developments in both fields, with neuroscientific insights informing AI architecture design and AI models providing new frameworks for understanding brain function. However, the relationship between biological and artificial intelligence remains complex and often misunderstood. While artificial neural networks are inspired by biological neurons, they operate on fundamentally different principles and scales. The human brain contains approximately 86 billion neurons with trillions of synaptic connections, creating a level of complexity that current AI systems cannot replicate. Nevertheless, advances in neuromorphic computing are attempting to bridge this gap by developing hardware that more closely mimics biological neural processes. The implications of this research extend beyond academic curiosity, potentially revolutionizing fields such as medical diagnosis, brain-computer interfaces, and cognitive enhancement technologies.",
          difficulty: "Advanced",
          estimatedTime: 20,
          questions: [
            {
              question: "What does the intersection of neuroscience and AI represent?",
              options: ["A boring topic", "One of the most fascinating frontiers", "An old field", "A simple subject"],
              correct: "One of the most fascinating frontiers"
            },
            {
              question: "How many neurons does the human brain contain approximately?",
              options: ["86 million", "86 billion", "86 thousand", "86 trillion"],
              correct: "86 billion"
            },
            {
              question: "What is neuromorphic computing attempting to do?",
              options: ["Replace humans", "Bridge the gap between biological and artificial systems", "Stop AI development", "Eliminate research"],
              correct: "Bridge the gap between biological and artificial systems"
            },
            {
              question: "What fields could be revolutionized by this research?",
              options: ["Only medicine", "Medical diagnosis, brain-computer interfaces, and cognitive enhancement", "Only computer science", "Only biology"],
              correct: "Medical diagnosis, brain-computer interfaces, and cognitive enhancement"
            },
            {
              question: "What creates the brain's complexity?",
              options: ["Only neurons", "Trillions of synaptic connections", "Simple processes", "Few connections"],
              correct: "Trillions of synaptic connections"
            }
          ]
        },
        {
          title: "Sustainable Energy and Economic Transformation",
          text: "The global transition to sustainable energy represents more than an environmental imperative; it constitutes a fundamental economic transformation that will reshape international relations, labor markets, and industrial structures. Renewable energy technologies, particularly solar and wind power, have achieved grid parity with fossil fuels in many regions, making the economic case for clean energy increasingly compelling. However, this transition presents complex challenges that extend beyond technological implementation. Energy storage solutions must be scaled to address the intermittency issues associated with renewable sources, while grid infrastructure requires comprehensive modernization to accommodate distributed energy generation. The geopolitical implications are equally significant, as countries heavily dependent on fossil fuel exports face the prospect of economic disruption, while nations with abundant renewable resources may emerge as new energy superpowers. Labor market transitions pose another critical challenge, as traditional energy sector workers require retraining and support to transition to new roles in the clean energy economy. The success of this transformation depends not only on continued technological innovation but also on coordinated policy responses that address the social and economic dimensions of the energy transition.",
          difficulty: "Advanced",
          estimatedTime: 20,
          questions: [
            {
              question: "What does the sustainable energy transition represent beyond environmental concerns?",
              options: ["Nothing important", "A fundamental economic transformation", "A simple change", "Only technology updates"],
              correct: "A fundamental economic transformation"
            },
            {
              question: "What have renewable energy technologies achieved in many regions?",
              options: ["Higher costs", "Grid parity with fossil fuels", "Complete failure", "No progress"],
              correct: "Grid parity with fossil fuels"
            },
            {
              question: "What must be scaled to address renewable energy challenges?",
              options: ["Fossil fuel production", "Energy storage solutions", "Coal mining", "Oil drilling"],
              correct: "Energy storage solutions"
            },
            {
              question: "What challenge do traditional energy sector workers face?",
              options: ["Too much money", "Need for retraining and support", "Too little work", "No challenges"],
              correct: "Need for retraining and support"
            },
            {
              question: "What does success depend on beyond technological innovation?",
              options: ["Nothing else", "Coordinated policy responses", "Only market forces", "Individual efforts"],
              correct: "Coordinated policy responses"
            }
          ]
        }
      ];
    }
  };

  const passages = getPassages();
  const currentPassageData = passages[currentPassage];
  const allQuestions = passages.flatMap((passage, passageIndex) => 
    passage.questions.map((q, qIndex) => ({
      ...q,
      globalIndex: passageIndex * passage.questions.length + qIndex,
      passageIndex,
      questionIndex: qIndex
    }))
  );

  const handleAnswerChange = (globalIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [globalIndex]: answer
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    const correct = allQuestions.filter(q => 
      selectedAnswers[q.globalIndex] === q.correct
    ).length;
    return Math.round((correct / allQuestions.length) * 100);
  };

  const goBack = () => {
    setCurrentMode('practice');
    setCurrentPassage(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reading Section</h2>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={currentMode === 'practice' ? 'default' : 'outline'}
            onClick={() => setCurrentMode('practice')}
          >
            Practice
          </Button>
          <Button 
            variant={currentMode === 'test' ? 'default' : 'outline'}
            onClick={() => setCurrentMode('test')}
          >
            IELTS Test
          </Button>
        </div>
      </div>

      {currentMode === 'practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Passage */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">{currentPassageData.title}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="secondary">{currentPassageData.difficulty}</Badge>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{currentPassageData.estimatedTime} min</span>
                      </div>
                    </div>
                  </div>
                  <Book className="h-6 w-6 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-justify leading-relaxed text-gray-800 dark:text-gray-100">
                  {currentPassageData.text}
                </p>
              </CardContent>
            </Card>

            {/* Passage Navigation */}
            <div className="flex justify-between items-center mt-4">
              <Button 
                onClick={() => setCurrentPassage(Math.max(0, currentPassage - 1))}
                disabled={currentPassage === 0}
                variant="outline"
              >
                Previous Passage
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Passage {currentPassage + 1} of {passages.length}
              </span>
              <Button 
                onClick={() => setCurrentPassage(Math.min(passages.length - 1, currentPassage + 1))}
                disabled={currentPassage === passages.length - 1}
                variant="outline"
              >
                Next Passage
              </Button>
            </div>
          </div>

          {/* Questions for current passage */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Star className="h-5 w-5" />
                  <span>Questions (Passage {currentPassage + 1})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 max-h-[600px] overflow-y-auto">
                {currentPassageData.questions.map((question, questionIndex) => {
                  const globalIndex = currentPassage * currentPassageData.questions.length + questionIndex;
                  return (
                    <div key={questionIndex} className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {globalIndex + 1}. {question.question}
                      </h4>
                      <RadioGroup 
                        value={selectedAnswers[globalIndex] || ""} 
                        onValueChange={(value) => handleAnswerChange(globalIndex, value)}
                      >
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value={option} 
                              id={`q${globalIndex}-${optionIndex}`} 
                            />
                            <Label 
                              htmlFor={`q${globalIndex}-${optionIndex}`}
                              className="cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {currentMode === 'test' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* All Passages */}
          <div className="lg:col-span-2 space-y-6">
            {passages.map((passage, passageIndex) => (
              <Card key={passageIndex}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-900 dark:text-white">
                        Passage {passageIndex + 1}: {passage.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary">{passage.difficulty}</Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{passage.estimatedTime} min</span>
                        </div>
                      </div>
                    </div>
                    <Book className="h-6 w-6 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-justify leading-relaxed text-gray-800 dark:text-gray-100">
                    {passage.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* All Questions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Star className="h-5 w-5" />
                  <span>Questions (1-{allQuestions.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 max-h-[600px] overflow-y-auto">
                {allQuestions.map((question) => (
                  <div key={question.globalIndex} className="space-y-3">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Passage {question.passageIndex + 1}
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {question.globalIndex + 1}. {question.question}
                    </h4>
                    <RadioGroup 
                      value={selectedAnswers[question.globalIndex] || ""} 
                      onValueChange={(value) => handleAnswerChange(question.globalIndex, value)}
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option} 
                            id={`q${question.globalIndex}-${optionIndex}`} 
                          />
                          <Label 
                            htmlFor={`q${question.globalIndex}-${optionIndex}`}
                            className="cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                {!showResults ? (
                  <Button 
                    onClick={handleSubmit}
                    className="w-full"
                    disabled={Object.keys(selectedAnswers).length !== allQuestions.length}
                  >
                    Submit All Answers
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {calculateScore()}%
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {calculateScore() >= 70 ? "Excellent work!" : "Keep practicing to improve."}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Button 
                      onClick={() => {
                        setShowResults(false);
                        setSelectedAnswers({});
                        setCurrentPassage(0);
                      }}
                      className="w-full"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingSection;
