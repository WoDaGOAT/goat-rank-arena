import{u as i,a as u,s as o,J as a}from"./index-D6Dh-tOY.js";const c=()=>{const{user:e}=i();return u({queryKey:["userQuizAttempts",e==null?void 0:e.id],queryFn:async()=>{if(!e)return[];const{data:s,error:t}=await o.from("quiz_attempts").select(`
                    id,
                    score,
                    completed_at,
                    quizzes (
                        title,
                        quiz_questions ( id )
                    )
                `).eq("user_id",e.id).order("completed_at",{ascending:!1}).limit(10);return t?(a.error("Failed to fetch your quiz history."),console.error("Error fetching user quiz attempts:",t),[]):(s==null?void 0:s.map(r=>({...r,quizzes:Array.isArray(r.quizzes)?r.quizzes[0]:r.quizzes})))||[]},enabled:!!e})};export{c as u};
