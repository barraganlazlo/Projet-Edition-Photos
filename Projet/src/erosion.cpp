#include <stdio.h>
#include <iostream>
#include "image_ppm.h"

using namespace std;
int get4voisins(OCTET * ImgIn , int nH, int nW, int i,int j, int *voisin);
int main(int argc, char* argv[])
{
  char cNomImgLue[250], cNomImgEcrite[250];
  int nH, nW, nTaille,nbErosion;
  int val=255;
  if (argc < 3)
  {
    printf("Usage: ImageIn.pgm ImageOut.pgm nbErosion (optional)invert\n");
    exit (1) ;
  }
  if(argc >4){
      val=0;
  }
  sscanf (argv[1],"%s",cNomImgLue);
  sscanf (argv[2],"%s",cNomImgEcrite);
  sscanf (argv[3],"%d",&nbErosion);

  OCTET *ImgIn, *ImgOut;

  lire_nb_lignes_colonnes_image_pgm(cNomImgLue, &nH, &nW);
  nTaille = nH * nW;

  allocation_tableau(ImgIn, OCTET, nTaille);
  allocation_tableau(ImgOut, OCTET, nTaille);
  lire_image_pgm(cNomImgLue, ImgOut, nTaille);

  int voisin[4];
  for(int k=0;k<nbErosion;k++){
    memcpy(ImgIn,ImgOut,nTaille);
    for (int i=0; i < nH; i++)
    {
      for (int j=0; j < nW; j++)
      {
        int nbv=get4voisins(ImgIn,nH,nW,i,j,voisin);
        for(int n=0;n<nbv;n++){
          if(voisin[n]==val){
            ImgOut[i*nW +j]=val;
            break;
          }
        }
      }
    }
  }

  ecrire_image_pgm(cNomImgEcrite, ImgOut,  nH, nW);
  free(ImgIn);
  return 1;
}
int get4voisins(OCTET * ImgIn , int nH, int nW, int i,int j, int *voisin){
    int nbv=0;
    if(i>0){
      voisin[0]=ImgIn[(i-1)*nW +j];
      nbv+=1;
    }
    if(j>0){
      voisin[1]=ImgIn[i*nW +(j-1)];
      nbv+=1;
    }
    if(j<nW-1){
      voisin[2]=ImgIn[i*nW +(j+1)];
      nbv+=1;
    }
    if(i<nH-1){
      voisin[3]=ImgIn[(i+1)*nW +j];
      nbv+=1;
    }
    return nbv;
}
int get8voisins(OCTET * ImgIn , int nH, int nW, int i,int j, int *voisin){
    int nbv=0;
    if(i>0){
      voisin[0]=ImgIn[(i-1)*nW +j];
      nbv+=1;
    }
    if(j>0){
      voisin[1]=ImgIn[i*nW +(j-1)];
      nbv+=1;
    }
    if(j<nW-1){
      voisin[2]=ImgIn[i*nW +(j+1)];
      nbv+=1;
    }
    if(i<nH-1){
      voisin[3]=ImgIn[(i+1)*nW +j];
      nbv+=1;
    }
    if(i>0 && j>0){
      voisin[0]=ImgIn[(i-1)*nW +j];
    }
    if(i>0 && j>0){
      voisin[0]=ImgIn[(i-1)*nW +j];
    }
    if(i>0 && j>0){
      voisin[0]=ImgIn[(i-1)*nW +j];
    }
    if(i>0 && j>0){
      voisin[0]=ImgIn[(i-1)*nW +j];
    }
    return nbv;
}
