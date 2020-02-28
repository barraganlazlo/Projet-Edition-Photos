#include "image_ppm.h"
#include <stdio.h>
#include <iostream>
#include <fstream>

using namespace std;

struct RGB{
  int* r;
  int* g;
  int* b;
};

struct RGB histogram(OCTET *ImgIn, int nH, int nW);
int linearTransform(int n, int alpha, int beta);
int blur3D(int position, OCTET *ImgIn, int nH, int nW, int power = 1);
int getRow3D(int position, int nW);

int main(int argc, char **argv){
    char cNomImgLue[250], cNomImgEcrite[250];
    int nH, nW, nTaille, powerBlur = 1;

    if (argc < 4)
    {
      printf("Usage: ImageIn.ppm ImageOut.pgm powerBlur\n");
      exit (1) ;
    }
    sscanf (argv[1],"%s",cNomImgLue);
    sscanf (argv[2],"%s",cNomImgEcrite);
    sscanf (argv[3],"%d",&powerBlur);

    cout << powerBlur << endl;

    OCTET *ImgIn, *ImgOut;

    lire_nb_lignes_colonnes_image_ppm(cNomImgLue, &nH, &nW);
    nTaille = nH * nW;

    allocation_tableau(ImgIn, OCTET, nTaille *3);
    lire_image_ppm(cNomImgLue, ImgIn, nTaille);
    allocation_tableau(ImgOut, OCTET, nTaille * 3);

    //Get histogram
    //struct RGB hist = histogram(ImgIn, nH, nW);

    //Apply Dynamic expension
    int position;
    int realPosition;
    for (int i=0; i < nH; i++) {
      for (int j=0; j < nW; j++) {
        position = i*nW*3+j*3;
        ImgOut[position] = blur3D(position, ImgIn, nH, nW, powerBlur);
        ImgOut[position + 1] = blur3D(position + 1, ImgIn, nH, nW, powerBlur);
        ImgOut[position + 2] = blur3D(position + 2, ImgIn, nH, nW, powerBlur);
      }
    }

    ecrire_image_ppm(cNomImgEcrite, ImgOut,  nH, nW);
    free(ImgIn);
    free(ImgOut);

    return 0;
}

int blur3D(int position, OCTET *ImgIn, int nH, int nW, int power){
  int moyenne = 0;
  int nbElements = 0;

  int voisins = 1 + power * 2; // Ex 1 -> 8 voisins

  for(int i = 0; i < voisins; i++){ //Parcours Hauteur
    int posLargeur = position + (i - 1) * (nW * 3);
    for(int j = 0; j < voisins; j++){ //Parcours Largeur
      int pos = posLargeur + j*3 - 3 * power;
      //Si pos n'est pas en dehors de l'image et que celui-ci est sur la même ligne que l'élément centré
      if(pos >= 0 && getRow3D(pos, nW) == getRow3D(posLargeur, nW) && pos < (nH * nW * 3)){
        moyenne += (int)ImgIn[pos];
        nbElements++;
      }
    }
  }
  if(nbElements == 0) return ImgIn[position];
  return moyenne / nbElements;
}

int getRow3D(int position, int nW){
  return (int)(position / (3*nW));
}

struct RGB histogram(OCTET *ImgIn, int nH, int nW){
  struct RGB occ;
  occ.r = (int*) malloc(256 * sizeof(int));
  occ.g = (int*) malloc(256 * sizeof(int));
  occ.b = (int*) malloc(256 * sizeof(int));
  for(int i=0; i<256; i++){
      occ.r[i]=0;
      occ.g[i]=0;
      occ.b[i]=0;
  }
  for (int i=0; i < nH; i++) {
      for (int j=0; j < nW; j++) {
          occ.r[ImgIn[i*nW*3+j*3]]+=1;
          occ.g[ImgIn[i*nW*3+j*3 +1]]+=1;
          occ.b[ImgIn[i*nW*3+j*3 +2]]+=1;
      }
  }

  return occ;
}

int linearTransform(int n, int alpha, int beta){
  return 255 * ((float)(n - alpha) / (float)(beta - alpha));
}
