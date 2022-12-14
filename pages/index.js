import React from "react";
import HomeVideo from "../src/components/HomeVideo";
import MenuMobile from "../src/components/Menu/MenuMobile";
import MenuDesktop from "../src/components/Menu/MenuDesktop";
import WorksList from "../src/components/WorksList";
import { Box, Show, Hide } from "@chakra-ui/react";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import Head from "next/head";

const index = ({
  menuData,
  menuProjectOrder,
  projectData,
  metaDescription,
  homeVideo,
}) => {
  return (
    <>
      <Head>
        <title>ANDRÉS JURADO</title>
        <meta name="description" content={metaDescription} />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Hide above="md">
        <Box>
          <MenuMobile isIndex={true} />
          <HomeVideo src={homeVideo} />
        </Box>
      </Hide>
      <Show above="md">
        <HomeVideo src={homeVideo} />
        <MenuDesktop menuCategories={menuData.categoriesList} isIndex={true} />
      </Show>
      <WorksList
        menuCategories={menuData.categoriesList}
        menuProjectOrder={menuProjectOrder}
        projectData={projectData}
      />
    </>
  );
};

export async function getStaticProps(context) {
  const settingsDirectory = path.join(process.cwd(), "settings");

  // LEER CATEGORIAS DESDE LA CONFIGURACION

  const menuCategories = matter(
    fs.readFileSync(settingsDirectory + "/categories.md", "utf8")
  );

  const menuData = menuCategories.data;

  // TRAER META DESCRIPTION

  const metaDescriptionRaw = matter(
    fs.readFileSync(settingsDirectory + "/general-content.md", "utf8")
  );

  const metaDescription =
    context.locale === "en"
      ? metaDescriptionRaw.data.metaDescriptionEN
      : metaDescriptionRaw.data.metaDescriptionES;

  // TRAER VIDEO DE PORTADA

  const homeVideo = metaDescriptionRaw.data.coverVideo;

  // TRAER LISTADO DE PROYECTOS

  const menuProjectOrderRaw = matter(
    fs.readFileSync(settingsDirectory + "/general-content.md", "utf8")
  );

  const menuProjectOrder =
    context.locale === "en"
      ? menuProjectOrderRaw.data.projectOrderEN
      : menuProjectOrderRaw.data.projectOrderES;

  // TRAER TODOS LOS PROYECTOS COMPLETOS PARA ORDENARLOS POR CATEGORÍA

  const projectsDirectory = path.join(process.cwd(), "content");

  const projectFiles = fs.readdirSync(
    projectsDirectory + "/" + context.locale + "/projects"
  );

  const projectData = {};

  projectFiles.forEach((file) => {
    const objectData = matter(
      fs.readFileSync(
        projectsDirectory + "/" + context.locale + "/projects/" + file,
        "utf8"
      )
    );

    // CONSEGUIR COLOR DE LA CATEGORIA PARA ENVIARLO AL OBJETO

    let categoryColorIndex =
      context.locale === "en"
        ? menuData.categoriesList.findIndex(
            (category) =>
              category.category.titleEN == objectData.data.category[0]
          )
        : menuData.categoriesList.findIndex(
            (category) =>
              category.category.titleES == objectData.data.category[0]
          );

    projectData[objectData.data.title] = {
      title: objectData.data.title,
      filename: file.replace(".md", ""),
      category: objectData.data.category,
      color: menuData.categoriesList[categoryColorIndex].category.color,
    };
  });

  return {
    props: {
      menuData,
      menuProjectOrder,
      projectData,
      metaDescription,
      homeVideo,
    },
  };
}

export default index;
