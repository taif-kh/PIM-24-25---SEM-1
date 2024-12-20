import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../src/App.css";
import { UserContext } from './UserContext';
import Typewriter from "typewriter-effect";




const HRHome = () => {
  const {user, removeToken} = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState({});
  const [myJobs, setMyJobs] = useState([]);
  const navigate = useNavigate();
  const [jobKeywords, setJobKeywords] = useState(["HTML", "CSS", "JavaScript"]);
  //-------------------
  const [jobDescription, setJobDescription] = useState(""); // Description du job
  const [matchingScores, setMatchingScores] = useState([]); // Liste des scores de matching
	const [error, setError] = useState(""); // Gestion des erreurs
	const [loading, setLoading] = useState(false); // État de chargement
  const [extractedSkills, setExtractedSkills] = useState(""); // État pour afficher les compétences extraites
	const [selectedSkill, setSelectedSkill] = useState(""); // État pour la compétence sélectionnée dans la liste déroulante
  //-------------------




console.log(user);


useEffect(() => {
  axios.get(`http://localhost:3000/users/myJobs/${currentUser.id}`).then(response => {
    setMyJobs(response.data);
    console.log(response.data);
  });
}, [currentUser.id]);



useEffect(() => {
  if (user?.id) {
    axios.get(`http://localhost:3000/users/${user.id}`).then((response) => {
      setCurrentUser(response.data);
      console.log("userDetails", response.data);
    }).catch((error) => {
      console.error('Error fetching user data:', error);
    });
  }
}, [user?.id]); 

    // --------------------------------------------------------
    const addJob = async (e) => {
      e.preventDefault();
    
      const jobName = e.target.jobName.value;
      const jobDesc = e.target.jobDesc.value;
      const userId = e.target.userId.value;
      const companyTitle = e.target.companyTitle.value;
      // const keywords = jobKeywords.join(', ') + ", " + e.target.extraKeywords.value;
    const keywords = extractedSkills;
    
      try {
        const response = await axios.post('http://localhost:3000/users/addJob', {
          jobName,
          jobDesc,
          userId,
          companyTitle,
          keywords,
        }, {
          headers: { 'Content-Type': 'application/json' }, 
        });
    
        console.log(response.data);
      } catch (error) {
        console.error('Error adding job:', error);
      }

      window.location.reload();
    };

    console.log(myJobs);
  


    //----------------------------------------------------------------
    const handleScoring = async (e) => {
      e.preventDefault(); // Empêcher le rechargement de la page
      setLoading(true); // Démarrer le chargement
  
      try {
        const response = await fetch("http://127.0.0.1:5000/matching-resumes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description: jobDescription }),
        });
  
        const result = await response.json(); // Récupérer la réponse JSON
        console.log(result); // Afficher la réponse dans la console pour inspecter les données
  
        if (response.ok) {
          // Si la réponse est correcte, mettre à jour les scores de matching
          const transformedScores =
            result.scores?.map((score, index) => ({
              filename: result.filenames?.[index] || `Fichier ${index + 1}`, // Dynamique ou par défaut
              score: score || 0, // Ajouter une valeur par défaut pour le score
            })) || [];
  
          setMatchingScores(transformedScores);
          setError(""); // Réinitialiser les erreurs
        } else {
          setError(result.error || "Une erreur est survenue lors du traitement.");
        }
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Erreur de connexion avec le serveur Flask."); // Erreur de connexion
      } finally {
        setLoading(false); // Arrêter le chargement
      }
    };



    	// Liste de compétences prédéfinies
	const predefinedSkills = [
		"JavaScript",
		"React",
		"Node.js",
		"Python",
		"Machine Learning",
		"Data Science",
		"SQL",
		"Project Management",
		"UI/UX Design",
	];

  let debounceTimer;

  const handleSkillExtraction = (description) => {
    clearTimeout(debounceTimer); // Clear previous timer
    debounceTimer = setTimeout(async () => {
      if (description.trim()) {
        try {
          const response = await fetch("http://127.0.0.1:5000/classify-job", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ description }), // Send job description to Flask API
          });
  
          const result = await response.json();
          if (response.ok) {
            const skillsString = result.skills.join(", "); // Combine extracted skills
            setExtractedSkills(skillsString);
            setError(""); // Reset error
          } else {
            setError(result.error); // Handle API errors
          }
        } catch (err) {
          setError("Erreur de connexion avec le serveur Flask."); // Connection error
        }
      }
    }, 500); // Delay for 500ms
  };
  

	// Fonction pour ajouter la compétence sélectionnée à l'espace de texte
	const handleAddSkill = () => {
		if (selectedSkill && !extractedSkills.includes(selectedSkill)) {
			setExtractedSkills(
				extractedSkills ? `${extractedSkills}, ${selectedSkill}` : selectedSkill
			); // Ajouter la compétence à l'espace de texte
		}
	};
    //----------------------------------------------------------------



  return (
    <html lang="en">
      <body className="border-white border-2 flex flex-col px-40 font-inter">
        {user && (
          // USER EXISTS
          <div className="bg-white text-black ">
                    {/* token */}
            <div className='text-white text-xs'>

            <p>Name: {user.username} Id: {user.id} Email: {user.email}</p>

            <p>
              {user.token || localStorage.getItem("jwt_token")}
            </p>
            </div>
                    {/* token */}


{/* Welcome */}
<div className='flex justify-between items-end'>
  <h5>Welcome, {user.username}</h5>
<button onClick={() => {
              removeToken();
              navigate("/");
            }} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
              Log Out
            </button>
</div>
{/* Welcome */}


            {/* ------------------------------------------------------ */}
            {/* MAIN */}
            <div className=''>
<div className='h-14 w-full '></div>
<h2 className="text-center">Add a new job</h2>
<div className='h-3 w-full'></div>
{/* Add job */}
<form className='flex flex-col gap-x-5 items-center justify-center' onSubmit={addJob}>
<div className='h-3 w-full'></div>
<div className='w-full flex flex-col items-start px-12 '>
<h5>Job's title</h5>
<input type="text" name="jobName" className='rounded-lg border-2 border-black h-9 w-96 p-2' />
<div className='h-4 w-full'></div>
{/* px-[400px] */}
<label>
  <h5>Job's description</h5>
</label>
<textarea
  type="text"
  name="jobDesc"
  value={jobDescription}
  onChange={(e) => {
    setJobDescription(e.target.value);
    handleSkillExtraction(e.target.value);
  }}
  className="rounded-lg border-2 border-black w-[1056px] h-80 p-2"
/>
<div className="h-4 w-full"></div>



<div>
  <h5>Extracted Skills:</h5>
  <textarea
    value={extractedSkills}
    readOnly
    className="rounded-lg border-2 border-black w-[1056px] h-20 p-2"
  />
</div>

 
<div>
				<label htmlFor='skill-select'><h5>Add a skill:</h5></label>
				<div className='flex items-center'>
        <select
					id='skill-select'
          className='h-10'
					value={selectedSkill}
					onChange={(e) => setSelectedSkill(e.target.value)}>
					<option value=''>-- Select a skill --</option>
					{predefinedSkills.map((skill, index) => (
						<option key={index} value={skill}>
							{skill}
						</option>
					))}
				</select>
				<button
					type='button'
          className='w-full h-10 flex items-center justify-center pl-5'
					onClick={handleAddSkill}
					disabled={!selectedSkill}>
          <img src="/check.png"  className=' w-7 h-7 bg-green-400'/>
				</button>
        </div>
			</div>

{/* w-96  h-28 */}






{/* Keywords */}
{/* <h5>Your keywords are: {jobKeywords.join(', ')} </h5> */}
{/* <div className='flex gap-x-2 items-center'>
                                                 <div className='text-2xl '>
            <Typewriter
                onInit={(typewriter) => {
                    typewriter
                        .typeString("Your keywords are: ")
                        .pauseFor(1000)
                        .typeString(`${jobKeywords.join(', ')}`)
                        .start();
                }}
            />  
        </div>
<button className='w-32 border-2 border-black h-10'><h5>Add</h5></button>
<input type="text" name="extraKeywords" className='rounded-lg border-2 border-black h-9 w-96 p-2' placeholder='Add keyword'  />
</div> */}
{/* Keywords */}

<div className='h-4 w-full'></div>
<input type='hidden' name="userId" value={user.id} />
<input type='hidden' name="companyTitle" value={currentUser.fullName} />
<div className='h-4 w-full'></div>
<div className='w-full flex justify-center '>
<button type="submit" className='w-72 h-20 bg-[#0074E8] text-white '><h5>Submit</h5></button>
</div>
</div>
</form>
{/* Add job */}

<div className='h-5 w-full'></div>
<h4>My jobs/ </h4>
<div className='h-6 w-full  '></div>

{/* Two posts */}
{
  myJobs.length > 0 && myJobs.map((job, i) => (
    <div key={i} className="cursor-pointer" onClick={() => navigate(`/${job.id}`)}>
<div className='h-32 w-full border-2 border-black flex items-center justify-between px-20'>
<h4 className='w-1/2 '>{job.name} </h4>
  <h5 className='w-1/2 text-end'>Posted {job.relativeTime} </h5>
</div>

<div className='h-3 w-full'></div>
</div>
  ))
}

{/* Two posts */}






{/* Resume upload */}
{/* <div className='flex items-end'><h4>Upload resume/ </h4>   <h5>(.txt or .pdf)</h5>    </div>
<div className='h-6 w-full bg-yellow-400 '></div>
              <form onSubmit={handleSubmit} className='border-2 border-black flex items-center justify-center w-full h-48'>
<label
htmlFor='uploadResume'
className='cursor-pointer w-[280px] h-12 border-2 border-black flex items-center justify-center'
>
<h5>  {selectedFile? "Change" : "Upload"} resume</h5>
</label>
<div className='w-1 h-2'></div>
{selectedFile && <button type="submit" className='w-[280px] h-12 border-2 bg-blue-500 border-black text-white'><h5>Upload</h5></button> }
                  <input id="uploadResume" type="file" name="resumeLink" onChange={handleFileChange} className='hidden'/>
                  <input type='hidden' value={user.id} name="userId" />

      </form>

      <div className='h-6 w-full bg-yellow-400 '></div> */}

      {/* Resume upload */}



      {/* <h4>Latest jobs/ </h4>
      <Link>HR</Link> */}

            </div>
                        {/* MAIN */}




{/* dbdfbfdbdfbfdbdf */}

{/* dbdfbfdbdfbfdbdf */}









{/* bfdfbdfbfbfbnfnbfgnfgnfgnng */}



{/* bfdfbdfbfbfbnfnbfgnfgnfgnng */}





<div className='h-24 w-full '></div>




          </div>
                    // USER EXISTS

        )}

        {!user && 
            <div>
  
Error



            </div>
            }
      </body>
    </html>
  );
  
};

export default HRHome;