#include <stdio.h>
#include <iostream>
#include "image_ppm.h"

using namespace std;

int* diagram(OCTET *ImgIn_R,int nH,int nW);

int main(int argc, char* argv[])
{
  char cNomReference[250], cNomSecondaire[250], cNomImgEcrite[250];
  int nH, nW, nTaille;

  if (argc < 4)
  {
    printf("Usage: reference.pgm secondaire.pgm ImageOut.pgm ... \n");
    exit (1) ;
  }

  sscanf (argv[1],"%s",cNomReference);
  sscanf (argv[2],"%s",cNomSecondaire);
  sscanf (argv[3],"%s",cNomImgEcrite);

  OCTET *ImgIn_R, *ImgIn_B, *ImgOut;

  lire_nb_lignes_colonnes_image_pgm(cNomReference, &nH, &nW);
  nTaille = nH * nW;

  //Reference
  allocation_tableau(ImgIn_R, OCTET, nTaille);
  lire_image_pgm(cNomReference, ImgIn_R, nTaille);
  //Secondaire
  allocation_tableau(ImgIn_B, OCTET, nTaille);
  lire_image_pgm(cNomReference, ImgIn_B, nTaille);
  //Out
  allocation_tableau(ImgOut, OCTET, nTaille);

  //Get the datagram of the image
  int L = 256; //Layers
  int* diag_R = diagram(ImgIn_R, nH, nW);
  float* ddp_R = (float*) malloc(L * sizeof(float));
  float* fa_R = (float*) malloc(L * sizeof(float));

  int* diag_B = diagram(ImgIn_B, nH, nW);
  float* ddp_B = (float*) malloc(L * sizeof(float));
  float* fa_B = (float*) malloc(L * sizeof(float));

  for(int i = 0; i < L; i++){
    ddp_R[i] = (float)diag_R[i] / (float)nTaille;
    fa_R[i] = i == 0 ? ddp_R[i] : ddp_R[i] + fa_R[i - 1];

    ddp_B[i] = (float)diag_B[i] / (float)nTaille;
    fa_B[i] = i == 0 ? ddp_B[i] : ddp_B[i] + fa_B[i - 1];
  }

  //Apply Dynamic expension ( Egalisation )
  int position;
  for (int i=0; i < nH; i++) {
    for (int j=0; j < nW; j++) {
      position = i*nW + j;
      ImgOut[position] = (L - 1) * fa_B[ImgIn_B[position]];
    }
  }

  ecrire_image_pgm(cNomImgEcrite, ImgOut,  nH, nW);
  free(ImgIn_R);
  free(ImgIn_B);
  free(diag_R);
  free(diag_B);
  free(ddp_R);
  free(ddp_B);
  free(fa_R);
  free(fa_B);
  free(ImgOut);
  return 0;
}

int* diagram(OCTET *ImgIn_R,int nH,int nW){
  int* occ = (int*) malloc(256 * sizeof(int));
  //Init with 0
  for(int i=0; i<256; i++){ occ[i]=0; }
  for (int i=0; i < nH; i++) {
      for (int j=0; j < nW; j++) {
          occ[ImgIn_R[i*nW+j]]+=1;
      }
  }
  return occ;
}
