#include <stdio.h>
#include <iostream>
#include "image_ppm.h"

using namespace std;
int main(int argc, char* argv[])
{
  char cNomImgLue[250], cNomImgEcrite[250];
  int nH, nW, nTaille, nbSeuil;

  if (argc < 4)
  {
    printf("Usage: ImageIn.pgm ImageOut.pgm Seuil1 Seuil2 ... \n");
    exit (1) ;
  }

  sscanf (argv[1],"%s",cNomImgLue);
  sscanf (argv[2],"%s",cNomImgEcrite);
  nbSeuil = argc -3;
  int S[nbSeuil];
  for(int i=0;i<nbSeuil;i++){
    sscanf (argv[3+i],"%d",&S[i]);
  }

  OCTET *ImgIn, *ImgOut;

  lire_nb_lignes_colonnes_image_pgm(cNomImgLue, &nH, &nW);
  nTaille = nH * nW;

  allocation_tableau(ImgIn, OCTET, nTaille);
  lire_image_pgm(cNomImgLue, ImgIn, nTaille);
  allocation_tableau(ImgOut, OCTET, nTaille);



  for (int i=0; i < nH; i++) {
    for (int j=0; j < nW; j++) {
      for(int s=0; s<nbSeuil; s++) {
        if ( ImgIn[i*nW+j] < S[s]) {
          ImgOut[i*nW+j]=s *255/nbSeuil;
          break;
        }else{
          ImgOut[i*nW+j]=255;
        }
      }
    }
  }

  ecrire_image_pgm(cNomImgEcrite, ImgOut,  nH, nW);
  free(ImgIn);
  return 1;
}
