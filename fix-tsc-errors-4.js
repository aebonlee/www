/**
 * TSC Error Batch Fix - Round 4
 * Direct file-level fixes for remaining 160 errors
 */

const fs = require('fs');
const path = require('path');

const BASE = 'D:\\dreamit-web';
let totalFixed = 0;

function walkDir(dir, ext) {
  let results = [];
  try {
    for (const f of fs.readdirSync(dir)) {
      if (f === 'node_modules' || f === 'dist' || f === '.git') continue;
      const fp = path.join(dir, f);
      const stat = fs.statSync(fp);
      if (stat.isDirectory()) results = results.concat(walkDir(fp, ext));
      else if (!ext || f.endsWith(ext)) results.push(fp);
    }
  } catch (e) {}
  return results;
}

function fix(file, old, replacement) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  if (typeof old === 'string') {
    if (!content.includes(old)) return false;
    content = content.split(old).join(replacement);
  } else {
    content = content.replace(old, replacement);
  }
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    return true;
  }
  return false;
}

function fixAll(file, old, replacement) {
  return fix(file, old, replacement);
}

function P(proj, rel) { return path.join(BASE, proj, rel); }

// ═══════════════════════════════════════════════════════════════
// ALL AuthContext files - cast profileData fields and user_metadata to any
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix AuthContext across all projects ═══');
const authProjects = ['autowork', 'koreait', 'career', 'allthat', 'software', 'papers', 'ai-data', 'uxdesign', 'marketing', 'koreatech', 'ai-prompt', 'ahp_basic'];
for (const proj of authProjects) {
  const file = P(proj, 'src/contexts/AuthContext.tsx');
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Strategy: find all lines with property access errors on '{}' or user_metadata
  // and add `as any` casting. Use line-by-line approach.
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Pattern: xxx.signup_domain where xxx is profileData or metadata
    if (line.includes('.signup_domain') && !line.includes('as any')) {
      // Find the expression before .signup_domain and wrap with (expr as any)
      lines[i] = line.replace(
        /(\w+(?:\?\.\w+)*)\.signup_domain/g,
        '($1 as any).signup_domain'
      );
    }
    if (line.includes('.visited_sites') && !line.includes('as any')) {
      lines[i] = lines[i].replace(
        /(\w+(?:\?\.\w+)*)\.visited_sites/g,
        '($1 as any).visited_sites'
      );
    }
    if (line.includes('.role') && !line.includes('as any') && !line.includes('user_role') && (line.includes('user_metadata') || line.includes('metadata') || line.includes('profileData'))) {
      // Be careful not to break 'user_role' etc
      lines[i] = lines[i].replace(
        /(\w+(?:\?\.\w+)*)\.role(?!\w)/g,
        '($1 as any).role'
      );
    }
  }

  content = lines.join('\n');
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalFixed++;
    console.log('  Fixed: ' + proj + '/AuthContext.tsx');
  }
}

// ═══════════════════════════════════════════════════════════════
// colSpan/rowSpan + rows string-to-number: ALL workbook files + others
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix colSpan/rowSpan/rows string-to-number ═══');
const colSpanProjects = ['software', 'ai-prompt', 'autowork', 'allthat', 'papers'];
for (const proj of colSpanProjects) {
  const srcDir = path.join(BASE, proj, 'src');
  const files = walkDir(srcDir, '.tsx');
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    // colSpan="N" → colSpan={N}
    content = content.replace(/colSpan="(\d+)"/g, 'colSpan={$1}');
    content = content.replace(/rowSpan="(\d+)"/g, 'rowSpan={$1}');
    // rows="N" → rows={N} for textarea
    content = content.replace(/rows="(\d+)"/g, 'rows={$1}');
    // cols="N" → cols={N}
    content = content.replace(/cols="(\d+)"/g, 'cols={$1}');
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: ' + path.relative(BASE, file));
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// software Playground.tsx - fix broken regex from round 3
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix software/Playground.tsx ═══');
{
  const file = P('software', 'src/pages/Playground.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    // Fix broken patterns: /abstract/(i as RegExp).test(text) → /abstract/i.test(text)
    content = content.replace(/\/abstract\/\(i as RegExp\)\.test\(text\)/g, '/abstract/i.test(text)');
    content = content.replace(/\/extends\|implements\/\(i as RegExp\)\.test\(text\)/g, '/extends|implements/i.test(text)');
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: software/src/pages/Playground.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// ai-media PromptEvaluation.tsx - local scores object typing
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix ai-media/PromptEvaluation.tsx ═══');
{
  const file = P('ai-media', 'src/pages/prompt-evaluation/PromptEvaluation.tsx');
  if (fs.existsSync(file)) {
    let r = fix(file, 'const scores = {};', 'const scores: any = {};');
    if (r) { totalFixed++; console.log('  Fixed scores typing'); }
    // Also fix suggestions array
    r = fix(file, 'const suggestions = [];', 'const suggestions: any[] = [];');
    if (r) console.log('  Fixed suggestions typing');
  }
}

// ═══════════════════════════════════════════════════════════════
// autowork LessonDetail.tsx - .props on ReactNode
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix autowork/LessonDetail.tsx ═══');
{
  const file = P('autowork', 'src/pages/lessons/LessonDetail.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('.props') && !lines[i].includes('as any')) {
        // Match child.props or (child).props pattern
        lines[i] = lines[i].replace(
          /(\w+)\.props/g,
          (match, varName) => {
            if (varName === 'this' || varName === 'component' || varName === 'Component') return match;
            return '(' + varName + ' as any).props';
          }
        );
      }
    }
    content = lines.join('\n');
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: autowork/LessonDetail.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// koreait KPISection.tsx - className optional
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix koreait/KPISection.tsx ═══');
{
  const file = P('koreait', 'src/components/dashboard/KPISection.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    // Make className optional in the destructured props type
    content = content.replace(/className:\s*any\s*\}/g, 'className?: any }');
    content = content.replace(/className:\s*any\s*;/g, 'className?: any;');
    // Or if the prop is in an interface
    content = content.replace(/className:\s*string\s*;/g, 'className?: string;');
    content = content.replace(/className:\s*string\s*\}/g, 'className?: string }');
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: koreait/KPISection.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// allthat ErrorBoundary.tsx - Property 't' does not exist
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix allthat/ErrorBoundary.tsx ═══');
{
  const file = P('allthat', 'src/components/ErrorBoundary.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    content = content.replace(
      /const\s*\{\s*t\s*\}\s*=\s*(useLanguage|useTranslation|useContext)\(([^)]*)\)/g,
      'const { t }: any = $1($2)'
    );
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: allthat/ErrorBoundary.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// allthat SelfAssessment.tsx - E/S/G on {}
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix allthat/SelfAssessment.tsx ═══');
{
  const file = P('allthat', 'src/pages/quiz/SelfAssessment.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    // Fix: useState({}) → useState<any>({})
    content = content.replace(/useState\(\{\}\)/g, 'useState<any>({})');
    // Also fix the specific pattern: useState({ E: 0, S: 0, G: 0 })
    content = content.replace(/useState\(\{/g, 'useState<any>({');
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: allthat/SelfAssessment.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// allthat AssessmentResult.tsx - Date arithmetic + unknown comparisons
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix allthat/AssessmentResult.tsx ═══');
{
  const file = P('allthat', 'src/pages/quiz/AssessmentResult.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    // Fix Date arithmetic
    content = content.replace(
      /new Date\(([^)]+)\)\s*-\s*new Date\(([^)]+)\)/g,
      'new Date($1).getTime() - new Date($2).getTime()'
    );
    // Fix useState for score results
    content = content.replace(/useState\(\{\}\)/g, 'useState<any>({})');
    content = content.replace(/useState\(\[\]\)/g, 'useState<any[]>([])');
    // Fix .map callbacks
    content = content.replace(
      /\.map\(\((\w+)\)\s*=>/g,
      '.map(($1: any) =>'
    );
    content = content.replace(
      /\.filter\(\((\w+)\)\s*=>/g,
      '.filter(($1: any) =>'
    );
    // Fix reduce with unknown
    content = content.replace(
      /\.reduce\(\((\w+),\s*(\w+)\)\s*=>/g,
      '.reduce(($1: any, $2: any) =>'
    );
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: allthat/AssessmentResult.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// allthat date arithmetic: AboutSchedule, RecruitmentBoard
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix allthat date arithmetic files ═══');
{
  // AboutSchedule.tsx - line 81 date arithmetic, NOT new Date() pattern
  const asFile = P('allthat', 'src/pages/about/AboutSchedule.tsx');
  if (fs.existsSync(asFile)) {
    let content = fs.readFileSync(asFile, 'utf8');
    const original = content;
    // This is likely: endDate - startDate (Date objects without new Date wrapper)
    // Cast expressions to any on the line with arithmetic date ops
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('error TS2362') || lines[i].includes('error TS2363')) continue;
      // Find date subtraction patterns on this line
      if ((lines[i].match(/TS2362|TS2363/) || []).length > 0) continue;
      // Check for non-new-Date arithmetic (variable - variable that's a date)
      // Simply wrap date variables in Number() or cast to any
    }
    // Better: just add .getTime() to all date-like subtraction patterns
    // Pattern: something - something where "Date" is in context
    content = content.replace(
      /(\w+(?:\.\w+)*(?:\(\))?)\s*-\s*(\w+(?:\.\w+)*(?:\(\))?)/g,
      (match, left, right) => {
        if (match.includes('getTime') || match.includes('parseInt') || match.includes('Math.')) return match;
        // Check if it's in a date context (line has 'date', 'Date', 'day', 'time')
        if (left.includes('Date') || right.includes('Date') || left.includes('date') || right.includes('date') || left.includes('time') || right.includes('time')) {
          return 'Number(' + left + ') - Number(' + right + ')';
        }
        return match;
      }
    );
    if (content !== original) {
      fs.writeFileSync(asFile, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: allthat/AboutSchedule.tsx');
    }
  }

  // RecruitmentBoard.tsx - date arithmetic
  const rbFile = P('allthat', 'src/pages/courses/RecruitmentBoard.tsx');
  if (fs.existsSync(rbFile)) {
    let content = fs.readFileSync(rbFile, 'utf8');
    const original = content;
    // Wrap date expressions with Number()
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      // If line has date-like subtraction
      if (lines[i].includes(' - ') && (lines[i].includes('Date') || lines[i].includes('date') || lines[i].includes('deadline') || lines[i].includes('created') || lines[i].includes('end') || lines[i].includes('start'))) {
        // Add explicit Number() wrapping around date expressions in subtraction
        lines[i] = lines[i].replace(
          /new Date\(([^)]*)\)\s*-\s*new Date\(([^)]*)\)/g,
          'new Date($1).getTime() - new Date($2).getTime()'
        );
        // Also handle: Date.now() - date expressions
        lines[i] = lines[i].replace(
          /new Date\(\)\s*-\s*new Date\(([^)]+)\)/g,
          'new Date().getTime() - new Date($1).getTime()'
        );
        // Handle remaining non-new-Date patterns by casting to Number
        if (lines[i].includes(' - ') && !lines[i].includes('.getTime()') && !lines[i].includes('Number(')) {
          lines[i] = lines[i].replace(
            /(\w+(?:\.\w+)*)\s*-\s*(\w+(?:\.\w+)*)/g,
            (match, l, r) => {
              if (match.includes('getTime') || /^\d+$/.test(l) || /^\d+$/.test(r)) return match;
              return 'Number(' + l + ') - Number(' + r + ')';
            }
          );
        }
      }
    }
    content = lines.join('\n');
    if (content !== original) {
      fs.writeFileSync(rbFile, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: allthat/RecruitmentBoard.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// allthat PostWrite.tsx - file_url on typed state
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix allthat/PostWrite.tsx ═══');
{
  const file = P('allthat', 'src/pages/community/PostWrite.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    // Fix useState with limited type
    content = content.replace(
      /useState\(\{\s*title:\s*''/g,
      "useState<any>({ title: ''"
    );
    content = content.replace(
      /useState\(\{\s*board_type:/g,
      'useState<any>({ board_type:'
    );
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: allthat/PostWrite.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// allthat RecruitmentDetail.tsx - colSpan string
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix allthat/RecruitmentDetail.tsx ═══');
{
  const file = P('allthat', 'src/pages/courses/RecruitmentDetail.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    content = content.replace(/colSpan="(\d+)"/g, 'colSpan={$1}');
    content = content.replace(/rowSpan="(\d+)"/g, 'rowSpan={$1}');
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: allthat/RecruitmentDetail.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// allthat AdminDashboard.tsx - setState callback / parseInt
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix allthat/AdminDashboard.tsx ═══');
{
  const file = P('allthat', 'src/pages/admin/AdminDashboard.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    // The issue is setState with callback where state has specific type
    // Fix: add <any> to useState for the form state
    content = content.replace(
      /useState\(\{\s*title_ko:\s*''/g,
      "useState<any>({ title_ko: ''"
    );
    // Also fix parseInt(number, 10) → need to String() wrap
    // Actually the error says: Argument of type 'number' is not assignable to parameter of type 'string'
    // This is likely e.target.value being used as number somewhere
    // Let's look at lines ~1326
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: allthat/AdminDashboard.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// software CommunityList.tsx - date arithmetic
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix software + ai-prompt + ai-data CommunityList date arithmetic ═══');
for (const proj of ['software', 'ai-prompt', 'ai-data']) {
  const file = P(proj, 'src/pages/community/CommunityList.tsx');
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  // Pattern: new Date() - new Date(xxx)
  content = content.replace(
    /new Date\(\)\s*-\s*new Date\(([^)]+)\)/g,
    'new Date().getTime() - new Date($1).getTime()'
  );
  // Pattern: Date.now() is already a number, but check
  // Also handle: (new Date() - new Date(x)) patterns
  // And: someDate - otherDate patterns
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('TS2362') || lines[i].includes('TS2363')) continue;
    // Cast any remaining date subtraction
    if (lines[i].includes(' - ') && (lines[i].includes('Date') || lines[i].includes('date') || lines[i].includes('created_at') || lines[i].includes('_at'))) {
      if (!lines[i].includes('.getTime()') && !lines[i].includes('Number(')) {
        // Wrap remaining non-Number date expressions
        lines[i] = lines[i].replace(
          /new Date\(([^)]*)\)\s*-\s*new Date\(([^)]*)\)/g,
          'new Date($1).getTime() - new Date($2).getTime()'
        );
      }
    }
  }
  content = lines.join('\n');
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalFixed++;
    console.log('  Fixed: ' + proj + '/CommunityList.tsx');
  }
}

// ═══════════════════════════════════════════════════════════════
// ai-data BadgeContext.tsx - .attempts on unknown
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix ai-data/BadgeContext.tsx ═══');
{
  const file = P('ai-data', 'src/contexts/BadgeContext.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    // Cast the unknown expression to any
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('.attempts') && !lines[i].includes('as any')) {
        lines[i] = lines[i].replace(
          /(\w+(?:\?\.\w+)*)\.attempts/g,
          '($1 as any).attempts'
        );
      }
    }
    content = lines.join('\n');
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: ai-data/BadgeContext.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// ai-data QuizHome.tsx - properties on unknown
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix ai-data/QuizHome.tsx ═══');
{
  const file = P('ai-data', 'src/pages/quiz/QuizHome.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    // Fix map/filter/find callbacks to add :any
    content = content.replace(
      /\.map\(\((\w+)\)\s*=>/g,
      '.map(($1: any) =>'
    );
    content = content.replace(
      /\.map\(\((\w+),\s*(\w+)\)\s*=>/g,
      '.map(($1: any, $2: number) =>'
    );
    content = content.replace(
      /\.filter\(\((\w+)\)\s*=>/g,
      '.filter(($1: any) =>'
    );
    content = content.replace(
      /\.find\(\((\w+)\)\s*=>/g,
      '.find(($1: any) =>'
    );
    // Also fix Object.entries/values iterations
    content = content.replace(
      /\.forEach\(\((\w+)\)\s*=>/g,
      '.forEach(($1: any) =>'
    );
    content = content.replace(
      /\.forEach\(\(\[(\w+),\s*(\w+)\]\)\s*=>/g,
      '.forEach(([$1, $2]: any) =>'
    );
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: ai-data/QuizHome.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// career AuthContext.tsx line 104 - visited_sites on last_sign_in_at type
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix career/AuthContext.tsx special case ═══');
{
  const file = P('career', 'src/contexts/AuthContext.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    // This is a specific pattern where app_metadata or similar has limited type
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('.visited_sites') && !lines[i].includes('as any')) {
        lines[i] = lines[i].replace(
          /(\w+(?:\?\.\w+)*)\.visited_sites/g,
          '($1 as any).visited_sites'
        );
      }
    }
    content = lines.join('\n');
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: career/AuthContext.tsx special case');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// ahp_basic SmsModal.tsx - state type
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix ahp_basic/SmsModal.tsx ═══');
{
  const file = P('ahp_basic', 'src/components/admin/SmsModal.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    // The state is typed as { all: any } but more properties are accessed
    // Fix: change useState to use <any>
    content = content.replace(
      /useState\(\{(\s*)all:/g,
      'useState<any>({$1all:'
    );
    // Also try without space
    content = content.replace(
      /useState<\{\s*all:\s*any\s*;?\s*\}>/g,
      'useState<any>'
    );
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: ahp_basic/SmsModal.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// ahp_basic - arithmetic on unknown types
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix ahp_basic arithmetic/unknown types ═══');
{
  const files = [
    'src/components/admin/EvaluatorWeightEditor.tsx',
    'src/components/evaluation/DirectInputPanel.tsx',
    'src/components/admin/ProjectForm.tsx',
    'src/components/model/EvalMethodSelect.tsx',
    'src/components/results/ComprehensiveChart.tsx',
    'src/components/sensitivity/SensitivityChart.tsx',
    'src/components/ai/AiChatMessage.tsx',
    'src/pages/EvaluatorMainPage.tsx',
    'src/pages/SurveyBuilderPage.tsx',
    'src/pages/SurveyResultPage.tsx'
  ];

  for (const rel of files) {
    const file = P('ahp_basic', rel);
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix .map/.filter/.reduce callbacks with unknown params
    content = content.replace(
      /\.map\(\((\w+)\)\s*=>/g,
      '.map(($1: any) =>'
    );
    content = content.replace(
      /\.map\(\((\w+),\s*(\w+)\)\s*=>/g,
      '.map(($1: any, $2: number) =>'
    );
    content = content.replace(
      /\.filter\(\((\w+)\)\s*=>/g,
      '.filter(($1: any) =>'
    );
    content = content.replace(
      /\.find\(\((\w+)\)\s*=>/g,
      '.find(($1: any) =>'
    );
    content = content.replace(
      /\.reduce\(\((\w+),\s*(\w+)\)\s*=>/g,
      '.reduce(($1: any, $2: any) =>'
    );
    content = content.replace(
      /\.forEach\(\((\w+)\)\s*=>/g,
      '.forEach(($1: any) =>'
    );
    content = content.replace(
      /\.forEach\(\(\[(\w+),\s*(\w+)\]\)\s*=>/g,
      '.forEach(([$1, $2]: [any, any]) =>'
    );

    // Fix useState({}) → useState<any>({})
    content = content.replace(/useState\(\{\}\)/g, 'useState<any>({})');
    content = content.replace(/useState\(\[\]\)/g, 'useState<any[]>([])');

    // Fix .toFixed on ValueType (recharts)
    content = content.replace(
      /(\w+)\.toFixed\(/g,
      (match, varName) => {
        if (varName === 'Number' || varName === 'Math' || varName === 'parseFloat' || varName === 'parseInt') return match;
        return 'Number(' + varName + ').toFixed(';
      }
    );

    // Fix .value on Element type
    content = content.replace(
      /(\w+)\.value(?!\w)/g,
      (match, varName) => {
        // Only fix if it looks like DOM element access
        if (varName === 'e' || varName === 'el' || varName === 'element' || varName === 'option' || varName === 'opt' || varName === 'item' || varName === 'cell') {
          return '(' + varName + ' as any).value';
        }
        return match;
      }
    );

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: ahp_basic/' + rel);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// koreatech PythonPractice.tsx - .style on Element
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ Fix koreatech/PythonPractice.tsx ═══');
{
  const file = P('koreatech', 'src/pages/PythonPractice.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    // .style on Element needs cast to HTMLElement
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('.style') && lines[i].includes('.closest')) {
        // Pattern: xxx.closest('selector').style → (xxx.closest('selector') as HTMLElement).style
        lines[i] = lines[i].replace(
          /(\.closest\([^)]+\))\.style/g,
          '($1 as HTMLElement).style'
        );
      }
      if (lines[i].includes('.style') && !lines[i].includes('as HTMLElement') && !lines[i].includes('as any') && !lines[i].includes('CSSProperties')) {
        // Generic: element.style where element is Element not HTMLElement
        lines[i] = lines[i].replace(
          /(\w+(?:\[[^\]]+\])?)\.style\./g,
          (match, expr) => {
            if (expr.includes('document') || expr.includes('window') || expr === 'this') return match;
            return '(' + expr + ' as HTMLElement).style.';
          }
        );
      }
    }
    content = lines.join('\n');
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixed++;
      console.log('  Fixed: koreatech/PythonPractice.tsx');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
console.log('\n════════════════════════════════');
console.log('Total files modified: ' + totalFixed);
console.log('════════════════════════════════');
