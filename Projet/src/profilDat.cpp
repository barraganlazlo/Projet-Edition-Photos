#include "image_ppm.h"
#include <stdio.h>
#include <iostream>
#include <fstream>

using namespace std;

int main(int argc, char **argv){
  int nH, nW, nTaille;
  if (argc != 5) 
    {
      printf("Usage: ImageIn.pgm fichierOut.dat ligne/colonne num  \n"); 
      return 1;
    }
  
  char cNomImgLue[250];
  char type;
  int num;
  char BufferOut[250];
  
  sscanf (argv[1],"%s",cNomImgLue);
  sscanf (argv[2],"%s",BufferOut);
  sscanf (argv[3],"%c",&type);
  sscanf (argv[4],"%d",&num);

  OCTET *ImgIn;
  lire_nb_lignes_colonnes_image_pgm(cNomImgLue, &nH, &nW);
  nTaille = nH * nW;
  allocation_tableau(ImgIn, OCTET, nTaille);
  lire_image_pgm(cNomImgLue, ImgIn, nTaille);
  ofstream fileOut(BufferOut);

  if(type=='c'){
    for(int x = 0; x < nH; ++x)
      fileOut<<x<<" "<<(int)ImgIn[x * nW + num]<<endl;
  }

  if(type=='l'){
    for(int x = 0; x < nW; ++x)
      fileOut<<x<<" "<<(int)ImgIn[num *nW + x]<<endl;
  }


  return 0;

}
