import {
  useCallback as useCallbackU,
  useEffect as useEffectU,
  useState as useStateU,
  lazy as lazyU,
  Suspense as SuspenseU,
  useRef
} from 'react';
import refreshSVG from '../../assets/images/refresh-square-mini.svg';
import Button2 from '../Button/Button';
import Tooltip2 from '../Tooltip/Tooltip';
import styles5 from './editor.module.css';
import { useUser } from '../../context/UserContext';
import { getUserData } from '../../services/user';

import DOMPurify from 'dompurify'; // html and css only

const CodeMirrorLazy = lazyU(async () => {
  const [{ default: CodeMirror }, { dracula }] = await Promise.all([
    import('@uiw/react-codemirror'),
    import('@uiw/codemirror-theme-dracula')
  ]);

  return {
    default: function LazyEditor(props) {
      return <CodeMirror {...props} theme={dracula} />;
    }
  };
});

const UniversalEditor = ({
  className,
  initialCode,
  initialTestCases,
  answer,
  extensions,
  slug,
  taskId,
  prevId,
  nextId,
  setIframeContent = () => {},
  onRunCode
}) => {
  const EditorModes = {
    CODE: 'code',
    CONSOLE: 'console',
    TESTS: 'tests',
    ANSWER: 'answer'
  };

  // Configuration object for DOMPurify to sanitize HTML content.
  // It specifies additional tags and attributes to allow,
  // ensures unknown protocols are permitted, and retains the whole document structure.
  const sanitizeConfig = {
    ADD_TAGS: ['!doctype', 'html', 'head', 'meta', 'title', 'body', 'link'],
    ADD_ATTR: ['lang', 'charset', 'content', 'action'],
    KEEP_CONTENT: true,
    FORCE_BODY: false,
    WHOLE_DOCUMENT: true
  };

  const [consoleOutput, setConsoleOutput] = useStateU('');
  const [editorMode, setEditorMode] = useStateU(EditorModes.CODE);
  const [code, setCode] = useStateU();
  const [testCases, setTestCases] = useStateU('');
  const [timeLeft, setTimeLeft] = useStateU(1200);
  const intervalRef = useRef();
  const { user, setUser } = useUser();

  useEffectU(() => {
    // clear previous interval (slug/taskId) change
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // don't start new timer if 0 seconds left
    if (timeLeft === 0) return;
    // start new interval and safe it's id to ref
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        // clear interval when no time left
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slug, taskId]); // depends on course slug and task id

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  useEffectU(() => {
    setEditorMode(EditorModes.CODE);
    setConsoleOutput('');
    setTimeLeft(1);
  }, [slug, taskId]);

  useEffectU(() => {
    const savedCode = localStorage.getItem(`code-${slug}-${taskId}`);
    setCode(savedCode === null ? initialCode : savedCode);
    if (setIframeContent) {
      const sanitized = DOMPurify.sanitize(
        savedCode === null ? initialCode : savedCode,
        sanitizeConfig
      );
      setIframeContent(sanitized);
    }
    setTestCases(initialTestCases ? initialTestCases : '');
  }, [slug, taskId, initialCode, initialTestCases, setIframeContent]);

  const handleCodeChange = useCallbackU(
    (value) => {
      setCode(value);
      localStorage.setItem(`code-${slug}-${taskId}`, value);

      if (setIframeContent) {
        const sanitized = DOMPurify.sanitize(value, sanitizeConfig);
        setIframeContent(sanitized);
      }
    },
    [slug, taskId, setIframeContent]
  );

  const clearCode = () => {
    const userConfirmed = window.confirm(
      'האם אתה בטוח שברצונך לאפס את הקוד? כל השינויים יאבדו.'
    );

    if (userConfirmed) {
      setCode(initialCode);
      localStorage.removeItem(`code-${slug}-${taskId}`);
      setEditorMode(EditorModes.CODE);
    }
  };

  const handleHeaderBtnClick = (mode) => {
    setEditorMode(mode);
  };

  const runCode = async () => {
    try {
      setEditorMode(EditorModes.CONSOLE);
      setConsoleOutput('');
      const result = await onRunCode(code);

      if (result.success) {
        // on success timer stops
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null; //clear ref
        }
        setTimeLeft(0); // set timer to 0
        setConsoleOutput({
          message:
            'הצלחה! הפונקציה עברה את המבחנים. תשווה את הפתרון שלך עם פתרון שלנו ותעבור לשאלה הבאה.',
          userAnswer: code,
          teacherAnswer: answer
        });
        const updatedUser = await getUserData();
        setUser(updatedUser);
      } else if (!result.success) {
        setConsoleOutput({
          message: 'שגיאה! הקוד שלך לא עבר את כל הטסטים',
          failedTests: result.failedTests
        });
      }
    } catch (error) {
      setConsoleOutput({
        message: 'שגיאה בעת הפעלת הקוד, נסה שוב',
        error: error.stack
      });
    }
  };

  return (
    <div className={`${styles5.editor} ${className}`}>
      <div className={styles5.editorHeader}>
        <button
          className={`${styles5.editorHeaderBtn} ${
            editorMode === EditorModes.CODE ? styles5.active : ''
          }`}
          onClick={() => handleHeaderBtnClick(EditorModes.CODE)}
        >
          קוד
        </button>
        <button
          className={`${styles5.editorHeaderBtn} ${
            editorMode === EditorModes.CONSOLE ? styles5.active : ''
          }`}
          onClick={() => handleHeaderBtnClick(EditorModes.CONSOLE)}
        >
          קונסול
        </button>
        <button
          className={`${styles5.editorHeaderBtn} ${
            editorMode === EditorModes.TESTS ? styles5.active : ''
          }`}
          onClick={() => handleHeaderBtnClick(EditorModes.TESTS)}
        >
          טסטים
        </button>
        <button
          className={`${styles5.editorHeaderBtn} ${
            editorMode === EditorModes.ANSWER ? styles5.active : ''
          }`}
          onClick={() => handleHeaderBtnClick(EditorModes.ANSWER)}
        >
          תשובה
        </button>
      </div>

      <div className={styles5.editorContent}>
        {editorMode === EditorModes.CODE && (
          <SuspenseU fallback={<div>טעינת העורך...</div>}>
            <CodeMirrorLazy
              value={code}
              extensions={extensions}
              onChange={handleCodeChange}
              className={styles5.codeEditor}
            />
          </SuspenseU>
        )}

        {editorMode === EditorModes.CONSOLE && (
          <div className={styles5.editorTab}>
            <div className={styles5.consoleText}>
              {consoleOutput && (
                <div>
                  <p>{consoleOutput.message}</p>
                  {consoleOutput.userAnswer && (
                    <>
                      <p>פתרון שלך</p>
                      <pre className={styles5.codeField}>
                        {consoleOutput.userAnswer}
                      </pre>
                      {consoleOutput.teacherAnswer && (
                        <>
                          <p>פתרון שלנו</p>
                          <pre className={styles5.codeField}>
                            {consoleOutput.teacherAnswer}
                          </pre>
                        </>
                      )}
                    </>
                  )}
                  {consoleOutput.failedTests &&
                    consoleOutput.failedTests.map((test, index) => (
                      <div key={index} style={{ marginBottom: '1rem' }}>
                        <p style={{ color: 'red' }}>טסט {index + 1}</p>
                        {test.error && (
                          <p
                            style={{
                              whiteSpace: 'pre-wrap',
                              direction: 'ltr',
                              textAlign: 'right'
                            }}
                          >
                            {test.error}
                          </p>
                        )}
                        {test.logs && test.logs.length > 0 && (
                          <div>
                            <p>הפלט console.log בשביל טסט הזה :</p>
                            <ul>
                              {test.logs.map((log, i) => (
                                <li key={i}>{log}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {editorMode === EditorModes.TESTS && (
          <div className={styles5.editorTab}>
            {testCases ? (
              <pre className={styles5.pre}>{testCases}</pre>
            ) : (
              <p>אין טסטים זמינים...</p>
            )}
          </div>
        )}

        {editorMode === EditorModes.ANSWER && (
          <div className={styles5.editorTab}>
            {timeLeft === 0 ? (
              <pre className={styles5.codeField}>{answer}</pre>
            ) : (
              <div
                style={{ fontSize: '28px', color: 'var(--text-color-bright)' }}
              >
                תוכל לצפות בתשובה בעוד {minutes}:
                {seconds.toString().padStart(2, '0')}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles5.editorFooter}>
        <div className={styles5.editorFooterBtnWrapper}>
          <Button2
            className={`${styles5.editorFooterPrevBtn} ${
              prevId ? '' : styles5.disabled
            }`}
            to={prevId ? `/courses/${slug}/${prevId}` : '#'}
          >
            הקודם
          </Button2>
          {user ? (
            <Button2 className={styles5.editorFooterBtn} onClick={runCode}>
              הרץ
            </Button2>
          ) : (
            <Tooltip2 title="הסבר" text="רק משתמשים רשומים יכולים להריץ קוד">
              <Button2
                className={`${styles5.editorFooterBtn} ${styles5.disabled}`}
                onClick={runCode}
              >
                הרץ
              </Button2>
            </Tooltip2>
          )}
          <Button2
            className={`${styles5.editorFooterNextBtn} ${
              nextId ? '' : styles5.disabled
            }`}
            to={nextId ? `/courses/${slug}/${nextId}` : '#'}
          >
            הבא
          </Button2>
          <Tooltip2
            title="הסבר"
            text="Сбросить прогресс. Нажатие вернет состояние упражнения в исходное."
          >
            <button
              className={styles5.editorFooterRefreshBtn}
              onClick={clearCode}
            >
              <img src={refreshSVG} alt="Очистить код" />
            </button>
          </Tooltip2>
        </div>
      </div>
    </div>
  );
};

export default UniversalEditor;
