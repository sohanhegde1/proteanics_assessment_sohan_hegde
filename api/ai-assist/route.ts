// app/api/ai-assist/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Define the request and response types
interface AIAssistRequest {
  text: string;
  prompt: string;
}

interface AIAssistResponse {
  originalText: string;
  modifiedText: string;
  prompt: string;
}

// This is a more sophisticated mock implementation for AI text editing
function processTextWithAI(text: string, prompt: string): string {
  // Convert prompt to lowercase for easier matching
  const lowercasePrompt = prompt.toLowerCase();
  let modifiedText = text;
  
  // Track if we've applied any transformations
  let transformationApplied = false;

  // Make it more concise
  if (lowercasePrompt.includes('concise') || lowercasePrompt.includes('shorter') || lowercasePrompt.includes('brief')) {
    // Remove unnecessary words and phrases
    modifiedText = modifiedText
      .replace(/\bin my opinion\b|\bi think\b|\bi believe\b|\bbasically\b|\bliterally\b|\bactually\b|\bjust\b|\bvery\b|\breally\b|\bquite\b|\bin order to\b|\bthe fact that\b/gi, '')
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Shorten sentences if they're very long
    if (modifiedText.length > 100) {
      modifiedText = modifiedText
        .replace(/,\s*and\s+/g, ' and ')
        .replace(/\s*,\s*/g, ', ');
    }
    
    transformationApplied = true;
  }

  // Make it more formal
  if (lowercasePrompt.includes('formal') || lowercasePrompt.includes('professional') || lowercasePrompt.includes('business')) {
    // Replace contractions
    modifiedText = modifiedText
      .replace(/don't/g, 'do not')
      .replace(/can't/g, 'cannot')
      .replace(/won't/g, 'will not')
      .replace(/shan't/g, 'shall not')
      .replace(/hasn't/g, 'has not')
      .replace(/haven't/g, 'have not')
      .replace(/hadn't/g, 'had not')
      .replace(/didn't/g, 'did not')
      .replace(/isn't/g, 'is not')
      .replace(/aren't/g, 'are not')
      .replace(/wasn't/g, 'was not')
      .replace(/weren't/g, 'were not')
      .replace(/I'm/g, 'I am')
      .replace(/you're/g, 'you are')
      .replace(/he's/g, 'he is')
      .replace(/she's/g, 'she is')
      .replace(/it's/g, 'it is')
      .replace(/we're/g, 'we are')
      .replace(/they're/g, 'they are')
      .replace(/I've/g, 'I have')
      .replace(/you've/g, 'you have')
      .replace(/we've/g, 'we have')
      .replace(/they've/g, 'they have')
      .replace(/I'll/g, 'I will')
      .replace(/you'll/g, 'you will')
      .replace(/he'll/g, 'he will')
      .replace(/she'll/g, 'she will')
      .replace(/it'll/g, 'it will')
      .replace(/we'll/g, 'we will')
      .replace(/they'll/g, 'they will')
      .replace(/I'd/g, 'I would')
      .replace(/you'd/g, 'you would')
      .replace(/he'd/g, 'he would')
      .replace(/she'd/g, 'she would')
      .replace(/it'd/g, 'it would')
      .replace(/we'd/g, 'we would')
      .replace(/they'd/g, 'they would');
    
    // Replace casual terms with more formal alternatives
    modifiedText = modifiedText
      .replace(/\bkids\b/g, 'children')
      .replace(/\bguy(s)?\b/g, 'individual(s)')
      .replace(/\bawesome\b/g, 'excellent')
      .replace(/\bcool\b/g, 'satisfactory')
      .replace(/\bgot\b/g, 'received')
      .replace(/\bhuge\b/g, 'significant')
      .replace(/\ba lot\b/g, 'considerably')
      .replace(/\bstuff\b/g, 'items')
      .replace(/\bthings\b/g, 'matters')
      .replace(/\bbig\b/g, 'substantial')
      .replace(/\bad\b/g, 'advertisement')
      .replace(/\bapp\b/g, 'application')
      .replace(/\binfo\b/g, 'information')
      .replace(/\bpic\b/g, 'picture')
      .replace(/\bphone\b/g, 'telephone')
      .replace(/\bemail\b/g, 'electronic mail')
      .replace(/\bgood\b/g, 'excellent')
      .replace(/\bbad\b/g, 'unfavorable')
      .replace(/\byeah\b/g, 'yes')
      .replace(/\bnope\b/g, 'no');
    
    transformationApplied = true;
  }

  // Improve grammar and spelling
  if (lowercasePrompt.includes('grammar') || lowercasePrompt.includes('spelling') || lowercasePrompt.includes('correct')) {
    // Fix common grammar mistakes
    modifiedText = modifiedText
      .replace(/\b(me|him|her|them|us)\b\s+(and|or)\s+\b(I|he|she|they|we)\b/gi, function(match, p1, p2, p3) {
        // Fix "me and you" -> "you and I"
        return p3.toLowerCase() + ' ' + p2 + ' ' + p1;
      })
      .replace(/\bthey was\b/gi, 'they were')
      .replace(/\bI is\b/gi, 'I am')
      .replace(/\byou is\b/gi, 'you are')
      .replace(/\bhe are\b/gi, 'he is')
      .replace(/\bshe are\b/gi, 'she is')
      .replace(/\bit are\b/gi, 'it is')
      .replace(/\bI were\b/gi, 'I was')
      .replace(/\bthere's\s+(\w+\s+\w+)\b/gi, function(match, p1) {
        // Handle "there's two things" -> "there are two things"
        return 'there are ' + p1;
      })
      .replace(/\s+,/g, ',')
      .replace(/,(?!\s)/g, ', ')
      .replace(/\s+\./g, '.')
      .replace(/\.{2,}/g, '.')
      .replace(/\.\s*(?=[a-z])/g, function(match) {
        // Capitalize the first letter after a period
        return '. ' + match.trim().toUpperCase();
      });
    
    transformationApplied = true;
  }

  // Simplify language
  if (lowercasePrompt.includes('simple') || lowercasePrompt.includes('simplify') || lowercasePrompt.includes('easy')) {
    // Replace complex words with simpler ones
    modifiedText = modifiedText
      .replace(/\butilize\b/g, 'use')
      .replace(/\bfacilitate\b/g, 'help')
      .replace(/\bundertake\b/g, 'do')
      .replace(/\bpurchase\b/g, 'buy')
      .replace(/\bobtain\b/g, 'get')
      .replace(/\bcommence\b/g, 'start')
      .replace(/\bterminate\b/g, 'end')
      .replace(/\bimplement\b/g, 'use')
      .replace(/\brequisite\b/g, 'needed')
      .replace(/\balleviate\b/g, 'ease')
      .replace(/\bmitigate\b/g, 'reduce')
      .replace(/\belucidate\b/g, 'explain')
      .replace(/\bprocure\b/g, 'get')
      .replace(/\bexcogitate\b/g, 'think')
      .replace(/\bexacerbate\b/g, 'worsen')
      .replace(/\bameliorative\b/g, 'improving')
      .replace(/\bdelineate\b/g, 'describe')
      .replace(/\bexpostulate\b/g, 'argue');
    
    // Break up long sentences
    if (modifiedText.length > 80) {
      modifiedText = modifiedText
        .replace(/(\w+),\s+(\w+),\s+(\w+),\s+and\s+(\w+)/g, '$1, $2, and $3. Also, $4')
        .replace(/(\w+),\s+(\w+),\s+and\s+(\w+)/g, '$1, $2, and $3')
        .replace(/\b(however|moreover|furthermore|consequently|additionally)\b/gi, function(match) {
          return '. ' + match.charAt(0).toUpperCase() + match.slice(1);
        });
    }
    
    transformationApplied = true;
  }

  // Make text more elaborate/detailed
  if (lowercasePrompt.includes('elaborate') || lowercasePrompt.includes('expand') || lowercasePrompt.includes('detailed')) {
    // Add descriptive adjectives and adverbs
    modifiedText = modifiedText
      .replace(/\b(team)\b/g, 'dedicated team')
      .replace(/\b(goal)\b/g, 'ambitious goal')
      .replace(/\b(plan)\b/g, 'comprehensive plan')
      .replace(/\b(approach)\b/g, 'strategic approach')
      .replace(/\b(result)\b/g, 'significant result')
      .replace(/\b(problem)\b/g, 'challenging problem')
      .replace(/\b(solution)\b/g, 'innovative solution')
      .replace(/\b(quickly)\b/g, 'remarkably quickly')
      .replace(/\b(carefully)\b/g, 'meticulously')
      .replace(/\b(completely)\b/g, 'thoroughly and completely')
      .replace(/\b(improve)\b/g, 'substantially improve')
      .replace(/\b(increase)\b/g, 'dramatically increase')
      .replace(/\b(decrease)\b/g, 'significantly decrease');
    
    // Add more context
    if (!modifiedText.includes('This is important because')) {
      modifiedText += ' This is important because it provides essential context and additional information that enhances understanding and appreciation of the subject matter.';
    }
    
    transformationApplied = true;
  }

  // If no specific transformation was applied, make some general improvements
  if (!transformationApplied) {
    // Capitalize first letter of sentences
    modifiedText = modifiedText.replace(/(^\s*|[.!?]\s+)([a-z])/g, function(match, p1, p2) {
      return p1 + p2.toUpperCase();
    });
    
    // Fix spacing
    modifiedText = modifiedText
      .replace(/\s+/g, ' ')
      .replace(/,(?!\s)/g, ', ')
      .replace(/\s+\./g, '.')
      .trim();
    
    // If the prompt mentions a specific style or tone, add an appropriate statement
    if (lowercasePrompt.includes('engaging')) {
      modifiedText += ' This engaging revision aims to capture and maintain the reader\'s interest.';
    } else if (lowercasePrompt.includes('clear')) {
      modifiedText += ' This revision focuses on clarity and straightforward communication.';
    } else if (lowercasePrompt.includes('persuasive')) {
      modifiedText += ' This persuasive revision is designed to effectively convince the reader.';
    } else {
      // Generic enhancement based on prompt words
      const promptWords = prompt.split(/\s+/);
      if (promptWords.length > 0) {
        const lastWord = promptWords[promptWords.length - 1].replace(/[^a-zA-Z]/g, '');
        if (lastWord.length > 3) {
          modifiedText += ` This revision emphasizes ${lastWord.toLowerCase()}.`;
        }
      }
    }
  }

  return modifiedText;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { text, prompt }: AIAssistRequest = await request.json();

    // Validate input
    if (typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Process the text with our AI function
    const modifiedText = processTextWithAI(text, prompt);

    // Return the result
    const response: AIAssistResponse = {
      originalText: text,
      modifiedText,
      prompt,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in AI assist API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}