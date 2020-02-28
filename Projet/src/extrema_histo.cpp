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

void extrema(OCTET *ImgOut, int nH, int nW, int Smin, int Smax);
struct RGB histogram(OCTET *ImgIn, int nH, int nW);
int linearTransform(int n, int alpha, int beta);

int main(int argc, char **argv){
    char cNomImgLue[250], cNomImgEcrite[250];
    int nH, nW, nTaille, Smin, Smax;

    if (argc < 5)
    {
      printf("Usage: ImageIn.ppm ImageOut.ppm Smin Smax\n");
      exit (1) ;
    }
    sscanf (argv[1],"%s",cNomImgLue);
    sscanf (argv[2],"%s",cNomImgEcrite);
    sscanf (argv[3],"%i",&Smin);
    sscanf (argv[4],"%i",&Smax);

    OCTET *ImgIn, *ImgOut;

    lire_nb_lignes_colonnes_image_ppm(cNomImgLue, &nH, &nW);
    nTaille = nH * nW;

    allocation_tableau(ImgIn, OCTET, nTaille *3);
    lire_image_ppm(cNomImgLue, ImgIn, nTaille);
    allocation_tableau(ImgOut, OCTET, nTaille *3);

    //Get histogram
    struct RGB histOriginal = histogram(ImgIn, nH, nW);
    extrema(ImgIn, nH, nW, Smin, Smax); //SetExtrema
    struct RGB hist = histogram(ImgIn, nH, nW);
    cout << "coucou" << endl;

    //Get alpha & Beta
    int alpha_r = -1, alpha_g = -1, alpha_b = -1;
    int beta_r = -1, beta_g = -1, beta_b = -1;

    for (int i=0; i < 255; i++) {
      if(hist.r[i] > 0 && alpha_r == -1) alpha_r = i;
      if(hist.r[i] > 0) beta_r = i;
      if(hist.g[i] > 0 && alpha_g == -1) alpha_g = i;
      if(hist.g[i] > 0) beta_g = i;
      if(hist.b[i] > 0 && alpha_b == -1) alpha_b = i;
      if(hist.b[i] > 0) beta_b = i;
    }

    cout << "r : " << alpha_r << " / " << beta_r << endl;
    cout << "g : " << alpha_g << " / " << beta_g << endl;
    cout << "b : " << alpha_b << " / " << beta_b << endl;

    //Apply Dynamic expension
    int position;
    for (int i=0; i < nH; i++) {
      for (int j=0; j < nW; j++) {
        position = i*nW*3+j*3;
        ImgOut[position] = linearTransform(ImgIn[position], alpha_r, beta_r);
        ImgOut[position + 1] = linearTransform(ImgIn[position + 1], alpha_g, beta_g);
        ImgOut[position + 2] = linearTransform(ImgIn[position + 2], alpha_b, beta_b);
      }
    }

    ecrire_image_ppm(cNomImgEcrite, ImgOut,  nH, nW);
    free(ImgIn);

    return 0;
}

void extrema(OCTET *ImgOut, int nH, int nW, int Smin, int Smax){
  for (int i=0; i < nH; i++) {
      for (int j=0; j < nW; j++) {
          int pos = i*nW*3+j*3;
          ImgOut[pos] = ImgOut[pos] > Smax ? Smax : ImgOut[pos] < Smin ? Smin : ImgOut[pos];
          ImgOut[pos +1] = ImgOut[pos +1] > Smax ? Smax : ImgOut[pos +1] < Smin ? Smin : ImgOut[pos +1];
          ImgOut[pos +2] = ImgOut[pos +2] > Smax ? Smax : ImgOut[pos +2] < Smin ? Smin : ImgOut[pos +2];
      }
  }
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
