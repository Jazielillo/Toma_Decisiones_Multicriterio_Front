import ProjectCard from "../../Components/ProjectCard";
import SideBar from "../../Components/SideBar";


export default function Projects() {
    return (
        <SideBar>
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Proyectos</h1>
                <p className="font-bold text-gray-400">Gestiona tus proyectos de toma de decisiones</p>
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7">
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
            </div>

        </SideBar>
    )
}
