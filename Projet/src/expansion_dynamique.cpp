#include <stdio.h>
#include <iostream>
#include "image_ppm.h"

using namespace std;

int* diagram(OCTET *ImgIn,int nH,int nW);
int linearTransform(int n, int alpha, int beta);

int main(int argc, char* argv[])
{
  char cNomImgLue[250], cNomImgEcrite[250];
  int nH, nW, nTaille;

  if (argc < 2)
  {
    printf("Usage: ImageIn.pgm ImageOut.pgm ... \n");
    exit (1) ;
  }

  sscanf (argv[1],"%s",cNomImgLue);
  sscanf (argv[2],"%s",cNomImgEcrite);

  OCTET *ImgIn, *ImgOut;

  lire_nb_lignes_colonnes_image_pgm(cNomImgLue, &nH, &nW);
  nTaille = nH * nW;

  allocation_tableau(ImgIn, OCTET, nTaille);
  lire_image_pgm(cNomImgLue, ImgIn, nTaille);
  allocation_tableau(ImgOut, OCTET, nTaille);

  //Get the datagram of the image
  int* diag = diagram(ImgIn, nH, nW);

  //Get Alpha and Beta
  signed int alpha = -1; //Init
  signed int beta = -1; //Init
  for(int i = 0; i < 256; i++){
    if(diag[i] > 0 && alpha == -1) alpha = i;
    if(diag[i] > 0) beta = i;
  }

  cout << alpha << " / " << beta << endl;

  //Apply Dynamic expension
  int position;
  for (int i=0; i < nH; i++) {
    for (int j=0; j < nW; j++) {
      position = i*nW + j;
      ImgOut[position] = linearTransform(ImgIn[position], alpha, beta);
    }
  }

  ecrire_image_pgm(cNomImgEcrite, ImgOut,  nH, nW);
  free(ImgIn);
  free(ImgOut);
  free(diag);
  return 0;
}

int* diagram(OCTET *ImgIn,int nH,int nW){
  int* occ = (int*) malloc(256 * sizeof(int));
  //Init with 0
  for(int i=0; i<256; i++){ occ[i]=0; }
  for (int i=0; i < nH; i++) {
      for (int j=0; j < nW; j++) {
          occ[ImgIn[i*nW+j]]+=1;
      }
  }
  return occ;
}


int linearTransform(int n, int alpha, int beta){
  return 255 * ((float)(n - alpha) / (float)(beta - alpha));
}
