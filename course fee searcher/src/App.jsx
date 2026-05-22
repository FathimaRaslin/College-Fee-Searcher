import { useEffect, useState } from "react";
import Papa from "papaparse";
import { FaRobot, FaTimes } from "react-icons/fa";

function App() {

  // CSV DATA
  const [data, setData] = useState([]);
  const [allRows, setAllRows] = useState([]);

  // CHATBOT
  const [chatOpen, setChatOpen] = useState(false);

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! Ask me about colleges, fees, programs, or locations.",
    },
  ]);

  // FILTER VALUES
  const [filters, setFilters] = useState({
    state: "State",
    location: "Location",
    program: "Program",
    course: "Course / Specialization",
  });

  // SORT OPTION
  const [sortOrder, setSortOrder] = useState("");

  // DROPDOWN OPTIONS
  const [states, setStates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);

  // LOAD CSV
  useEffect(() => {

    Papa.parse("/College_Fees_Master_2026-27.csv", {

      download: true,
      header: true,
      skipEmptyLines: true,

      complete: (results) => {

        const rows = results.data.map((row) => {

          const cleanedRow = {};

          Object.keys(row).forEach((key) => {
            cleanedRow[key.trim()] = row[key];
          });

          return cleanedRow;
        });

        setData(rows);
        setAllRows(rows);

        // UNIQUE STATES
        setStates([
          ...new Set(
            rows
              .map((row) => row["State"]?.trim())
              .filter(Boolean)
          ),
        ]);

        // UNIQUE LOCATIONS
        setLocations([
          ...new Set(
            rows
              .map((row) => row["Location"]?.trim())
              .filter(Boolean)
          ),
        ]);

        // UNIQUE PROGRAMS
        setPrograms([
          ...new Set(
            rows
              .map((row) => row["Program"]?.trim())
              .filter(Boolean)
          ),
        ]);

        // UNIQUE COURSES
        setCourses([
          ...new Set(
            rows
              .map((row) => row["Course / Specialization"]?.trim())
              .filter(Boolean)
          ),
        ]);
      },
    });

  }, []);

  // FILTER LOCATIONS BASED ON STATE
  const filteredLocations =
    filters.state && filters.state !== "State"
      ? [
          ...new Set(
            allRows
              .filter(
                (row) =>
                  row["State"]?.trim() === filters.state
              )
              .map((row) => row["Location"]?.trim())
              .filter(Boolean)
          ),
        ]
      : locations;

  // FILTER COURSES BASED ON PROGRAM
  const filteredCourses =
    filters.program && filters.program !== "Program"
      ? [
          ...new Set(
            allRows
              .filter(
                (row) =>
                  row["Program"]?.trim() === filters.program
              )
              .map((row) => row["Course / Specialization"]?.trim())
              .filter(Boolean)
          ),
        ]
      : courses;

  // SEND CHAT MESSAGE
  const sendMessage = () => {

    if (!question.trim()) return;

    const updatedMessages = [
      ...messages,
      {
        sender: "user",
        text: question,
      },
    ];

    setMessages(updatedMessages);

    setTimeout(() => {

      setMessages([
        ...updatedMessages,
        {
          sender: "bot",
          text: "Backend AI integration will be connected later.",
        },
      ]);

    }, 700);

    setQuestion("");
  };

  return (

    <div className="min-h-screen bg-[#f8f6f1] flex flex-col items-center px-6 py-10">

      {/* TITLE */}
      <h1 className="text-5xl font-bold text-[#556b2f] mb-10 text-center">
        Course Fee Searcher
      </h1>

      {/* SEARCH BAR */}
      <div className="w-full max-w-4xl mb-10 relative">

        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search for a course to view fee"
          className="w-full pl-14 pr-5 py-5 rounded-3xl border border-gray-200 shadow-lg text-lg bg-white outline-none focus:border-[#556b2f] transition"
        />

      </div>

      {/* FILTER + SORT SECTION */}
      <div className="w-full max-w-7xl bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-xl p-7 mb-16">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

          {/* STATE */}
          <select
            value={filters.state}
            onChange={(e) =>
              setFilters({
                ...filters,
                state: e.target.value,
                location: "Location",
              })
            }
            className="p-4 rounded-2xl border border-gray-200 bg-[#fafaf7] shadow-sm outline-none focus:border-[#556b2f] transition text-gray-700"
          >

            <option value="State">
              State
            </option>

            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}

          </select>

          {/* LOCATION */}
          <select
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="p-4 rounded-2xl border border-gray-200 bg-[#fafaf7] shadow-sm outline-none focus:border-[#556b2f] transition text-gray-700"
          >

            <option value="Location">
              Location
            </option>

            {filteredLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}

          </select>

          {/* PROGRAM */}
          <select
            value={filters.program}
            onChange={(e) =>
              setFilters({
                ...filters,
                program: e.target.value,
                course: "Course / Specialization",
              })
            }
            className="p-4 rounded-2xl border border-gray-200 bg-[#fafaf7] shadow-sm outline-none focus:border-[#556b2f] transition text-gray-700"
          >

            <option value="Program">
              Program
            </option>

            {programs.map((program, index) => (
              <option key={index} value={program}>
                {program}
              </option>
            ))}

          </select>

          {/* COURSE */}
          <select
            value={filters.course}
            onChange={(e) =>
              setFilters({ ...filters, course: e.target.value })
            }
            className="p-4 rounded-2xl border border-gray-200 bg-[#fafaf7] shadow-sm outline-none focus:border-[#556b2f] transition text-gray-700"
          >

            <option value="Course / Specialization">
              Course / Specialization
            </option>

            {filteredCourses.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}

          </select>

          {/* SORT */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-4 rounded-2xl border border-gray-200 bg-[#fafaf7] shadow-sm outline-none focus:border-[#556b2f] transition text-gray-700"
          >

            <option value="">
              Sort By Fee
            </option>

            <option value="highToLow">
              Highest to Lowest
            </option>

            <option value="lowToHigh">
              Lowest to Highest
            </option>

          </select>

        </div>

      </div>

      {/* CHATBOT BUTTON */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 bg-[#556b2f] text-white p-5 rounded-full shadow-xl hover:scale-105 transition z-50"
      >

        {chatOpen ? <FaTimes size={22} /> : <FaRobot size={22} />}

      </button>

      {/* CHAT WINDOW */}
      {chatOpen && (

        <div className="fixed bottom-24 right-6 w-[360px] h-[520px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">

          {/* HEADER */}
          <div className="bg-[#556b2f] text-white px-5 py-4 text-lg font-semibold">
            AI College Assistant
          </div>

          {/* CHAT MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fafafa]">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                  msg.sender === "user"
                    ? "bg-[#556b2f] text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>

            ))}

          </div>

          {/* INPUT AREA */}
          <div className="border-t bg-white p-3 flex gap-2">

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask about colleges..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-[#556b2f]"
            />

            <button
              onClick={sendMessage}
              className="bg-[#556b2f] text-white px-4 rounded-xl hover:opacity-90 transition"
            >
              Send
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;